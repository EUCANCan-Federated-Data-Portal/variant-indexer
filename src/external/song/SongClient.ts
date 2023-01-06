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
import { Analysis, FileData, SongResponseGetAnalysis, SongResponsesGetAllStudies } from './';
import Logger from '../../logger';
import { createUrl } from '../../utils/urlUtils';
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
