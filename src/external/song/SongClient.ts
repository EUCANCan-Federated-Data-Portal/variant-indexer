/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import fetch from 'node-fetch-commonjs';

import { failure, Result, success } from '../../types/Result';
import { unknownToString } from '../../utils/stringUtils';
import {
	Analysis,
	AnalysisFilters,
	FileData,
	RequestPagination,
	SongResponseGetAnalysis,
	SongResponseGetPagedAnalyses,
	SongResponsesGetAllStudies,
	SongResponsGetAllAnalyses,
} from './';
import Logger from '../../logger';
import { createUrl, appendQueryParams } from '../../utils/urlUtils';
import config from '../../config';
const logger = Logger('SongClient');

class SongClient {
	host: string;

	constructor(config: { host: string }) {
		this.host = config.host;
	}

	/**
	 * Fetch list of all studies available in this Song repo
	 * @returns {Promise<Result<string[]>>}
	 */
	async fetchAllStudies(): Promise<Result<string[]>> {
		const url = createUrl(this.host, '/studies/all');

		try {
			const response = await fetch(url.toString());
			if (!response.ok) {
				return failure(`Song.fetchAllStudies response not ok`, response.status, response.statusText);
			}
			const content = await response.json();
			const studiesResult = SongResponsesGetAllStudies.safeParse(content);
			if (!studiesResult.success) {
				logger.debug(`Invalid response from Song.fetchAllStudies`, response.text(), studiesResult.error.issues);
				return failure(`Invalid response from Song.fetchAllStudies`, studiesResult.error.issues);
			}
			return success(studiesResult.data);
		} catch (error) {
			return failure(unknownToString(error));
		}
	}

	/**
	 * Fetch a single analysis by analysisId and studyID
	 * @param details
	 * @returns {Promise<Result<Analysis>>}
	 */
	async fetchAnalysis(details: { analysisId: string; studyId: string }): Promise<Result<Analysis>> {
		logger.debug(`Fetching single analysis`, details);
		const url = createUrl(this.host, 'studies', details.studyId, 'analysis', details.analysisId);

		try {
			const response = await fetch(url);
			if (!response.ok) {
				return failure(`Song.fetchAnalysis response not ok`, response.status, response.statusText);
			}
			const analysisResult = SongResponseGetAnalysis.safeParse(await response.json());
			if (!analysisResult.success) {
				logger.debug(`Invalid response from Song.fetchAnalysis`, response.text(), analysisResult.error.issues);
				return failure(`Invalid response from Song.fetchAnalysis`, analysisResult.error.issues);
			}
			return success(analysisResult.data);
		} catch (error) {
			return failure(unknownToString(error));
		}
	}

	async fetchAnalysisPage(details: {
		filters: AnalysisFilters;
		pagination: RequestPagination;
	}): Promise<Result<SongResponseGetPagedAnalyses>> {
		logger.debug(`Fetching page of analyses from Song`, details);

		const { filters, pagination } = details;

		const limit = pagination.limit || config.song.pageSize;
		const offset = pagination.offset || 0;
		const baseUrl = createUrl(this.host, 'studies', filters.study, 'analysis', 'paginated');
		const url = appendQueryParams(baseUrl, {
			limit: `${limit}`,
			offset: `${offset}`,
			analysisStates: filters.states,
		});

		try {
			const response = await fetch(url);
			if (!response.ok) {
				return failure(`Song.fetchAnalysisPage response not ok`, response.status, response.statusText);
			}

			const pageResult = SongResponseGetPagedAnalyses.safeParse(await response.json());
			if (!pageResult.success) {
				logger.debug(`Invalid response from Song.fetchAnalysisPage`, pageResult.error.issues);
				return failure(`Invalid response from Song.fetchAnalysisPage`, pageResult.error.issues);
			}
			return success(pageResult.data);
		} catch (error) {
			return failure(unknownToString(error));
		}
	}

	/**
	 * Repeatedly call Song.fetchAnalysisPage until all pages have been retrieved. Pages are returned asynchronously and can be read using an async iterator:
	 *
	 * Example usage:
	 * ```
	 * try {
	 *   const generator = fetchAllAnalysisPages({filters: {study:'EXAMPLE-INTL', states: ['PUBLISHED']}, pageSize: 50});
	 *   for await (const page of generator) {
	 *     page.analyses.forEach(analysis => {
	 *       // code for processing each analysis here
	 *     })
	 *   }
	 * } catch (error) {
	 *   // handle errors
	 * }
	 * ```
	 *
	 * Be aware that this method will throw an error if it cannot complete.
	 * @param {{filters: AnalysisFilters, pageSize: number}} details
	 * @return {AsyncGenerator<SongResponseGetPagedAnalyses>}
	 */
	async *fetchAllAnalysisPages(details: {
		filters: AnalysisFilters;
		pageSize?: number;
	}): AsyncGenerator<SongResponseGetPagedAnalyses> {
		const { filters, pageSize } = details;

		// If Song Legacy feature is enabled, we will fetch all analyses and structure the response as a page then resolve
		if (config.features.songLegacy) {
			logger.info('Fetching all analyses from legacy song API', details);
			const response = await this.fetchAllAnalyses({ filters });
			if (!response.success) {
				logger.error('Unable to retrieve any analyses', response.message);
				return;
			}
			const count = response.data.length;
			logger.info(`Retrieved all ${count} analyses for study`);
			yield { analyses: response.data, currentTotalAnalyses: count, totalAnalyses: count };
			return;
		}

		//

		logger.debug(`Fetching all analysis pages`, details);

		const limit = pageSize || config.song.pageSize;

		// totalAnalyses and nextOffset will be updated with every response of a song analyses page
		// totalAnalyses needs to be initialized with a value greater than nextOffset for the while loop to enter the first time
		let totalAnalyses: number = 1;
		let nextOffset: number = 0;
		const fetchNextPage = async (): Promise<Result<SongResponseGetPagedAnalyses>> => {
			const result = await this.fetchAnalysisPage({ filters, pagination: { limit, offset: nextOffset } });
			if (result.success) {
				totalAnalyses = result.data.totalAnalyses;
				nextOffset = nextOffset + limit;
			}
			return result;
		};

		// This loop is guaranteed to run at least once, after that it will continue to grab pages until our offset is beyond
		// the total number of analyses, at which point all analyses have been caught
		while (nextOffset < totalAnalyses) {
			const pageResult = await fetchNextPage();
			if (!pageResult.success) {
				// Error communicating with song, throwing error
				throw new Error(
					[
						'Failure fetching analysis page from song with',
						JSON.stringify({ limit: pageSize, offset: 0 }),
						pageResult.message,
					].join(' - '),
				);
			}
			// Return data
			yield pageResult.data;
		}
	}

	/**
	 * Legacy Song API which returns all analyses for a study in a single request.
	 * Do not use if possible, but when LEGACY SONG feature is enabled it indicates that the paginated
	 * API is not available so this should be used instead.
	 * @param details
	 * @returns
	 */
	async fetchAllAnalyses(details: { filters: AnalysisFilters }): Promise<Result<Analysis[]>> {
		logger.debug(`Fetching page of analyses from Song`, details);

		const { filters } = details;

		const baseUrl = createUrl(this.host, 'studies', filters.study, 'analysis');
		const url = appendQueryParams(baseUrl, {
			analysisStates: filters.states,
		});

		try {
			const response = await fetch(url);
			if (!response.ok) {
				return failure(`Song.fetchAllAnalyses response not ok`, response.status, response.statusText);
			}

			const pageResult = SongResponsGetAllAnalyses.safeParse(await response.json());
			if (!pageResult.success) {
				logger.debug(`Invalid response from Song.fetchAllAnalyses`, pageResult.error.issues);
				return failure(`Invalid response from Song.fetchAllAnalyses`, pageResult.error.issues);
			}
			return success(pageResult.data);
		} catch (error) {
			logger.error(`Failure fetching all analyses from Song`, error);
			return failure(unknownToString(error));
		}
	}

	/**
	 * Fetch a single file by objectId and studyID
	 * @param details
	 * @returns {Promise<Result<Analysis>>}
	 */
	async fetchFile(details: { objectId: string; studyId: string }): Promise<Result<FileData>> {
		const url = createUrl(this.host, 'studies', details.studyId, 'files', details.objectId);

		try {
			const response = await fetch(url);
			if (!response.ok) {
				return failure(`Song.fetchFile response not ok`, response.status, response.statusText);
			}
			const analysisResult = FileData.safeParse(await response.json());
			if (!analysisResult.success) {
				logger.debug(`Invalid response from Song.fetchFile`, response.text(), analysisResult.error.issues);
				return failure(`Invalid response from Song.fetchFile`, analysisResult.error.issues);
			}
			return success(analysisResult.data);
		} catch (error) {
			return failure(unknownToString(error));
		}
	}
}

export default SongClient;
