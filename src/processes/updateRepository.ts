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
import { uniq } from 'lodash';

import SongClient, { Analysis, FileData } from '../external/song';
import Repository from '../types/Repository';

import VcfExtractor, { VcfExtensions } from 'vcf-extraction';

import ScoreClient from '../external/score';
import * as variantService from '../services/variant';
import { unzipStream } from '../utils/unzip';
import Logger from '../logger';
import { VariantDoc } from '../services/variant/types';
const logger = Logger('Process', 'UpdateRepository');

const extractor = new VcfExtractor(VcfExtensions.ensembleVepParser);

/**
 * Process data for a file stored in repository.
 * 1. Update file entity
 * 2. For VCF files, fetch data from Repository and initiate variant processing.
 *
 * Note: For now this
 * @param args
 * @returns
 */
export const updateFile = async (args: { score: ScoreClient; file: FileData }): Promise<void> => {
	const { score, file } = args;

	logger.info('Updating File', file.objectId, file.fileName, file.fileType, file.fileAccess);

	// TODO: Create or get stored file, if new or changed save changes and mark for indexing

	if (file.fileType === 'VCF' && file.fileAccess === 'open') {
		// This is a variant calling file, we can fetch it and update variant entities
		const variantsToIndex: VariantDoc[] = [];

		try {
			logger.info('Fetching variant file', file.objectId, file.fileName);
			const contentResult = await score.streamFile({ objectId: file.objectId, fileLength: file.fileSize });
			if (!contentResult.success) {
				logger.error('Failed to retrieve file content', file.objectId, contentResult.message);
				return;
			}

			const fileContent = await unzipStream(contentResult.data);

			const variantGenerator = extractor.generateVariants(fileContent);

			const logWarnings: string[] = [];
			for await (const variantResult of variantGenerator) {
				// TODO: Create or get stored variant, if new or changed save changes and mark for indexing

				if (variantResult.success) {
					const variantDocResult = variantService.convertVariantToDoc(file.objectId, variantResult.data);
					if (variantDocResult.success) {
						variantsToIndex.push(variantDocResult.data);
					}
				} else {
					// Capture failure, we will collect the failed variants and log once for each file
					logWarnings.push(variantResult.message);
				}
			}

			// file variant parse failure logging
			if (logWarnings.length) {
				const failedVariants = logWarnings.length;
				logger.warn(
					file.analysisId,
					file.objectId,
					`Failed to parse ${logWarnings.length} variants. Reasons given were`,
					...uniq(logWarnings),
				);
			}
		} catch (error) {
			logger.error('Unable to download or parse file', file.objectId, error);
			return;
		}
		logger.debug(file.objectId, `Beginning indexing ${variantsToIndex.length} variants for file`);
		await variantService.indexVariants(variantsToIndex);
		logger.debug(file.objectId, `Finished indexing variants for file`);
	}
};

/**
 * Transform analysis into entity and list for indexing, for each file run updateFile
 * @param args
 */
const updateAnalysis = async (args: { song: SongClient; score: ScoreClient; analysis: Analysis }): Promise<void> => {
	const { song, score, analysis } = args;

	logger.info(`Updating Analysis`, analysis.analysisId);
	// TODO: Create or get stored analysis, if new or changed save changes and mark for indexing

	if (analysis.analysisState === 'PUBLISHED') {
		// TODO: remove files from index when not published

		for (const file of analysis.files) {
			await updateFile({ score, file });
		}
	}
};

/**
 * Fetch all analyses in repository, run updateAnalysis on each to transform into tracked entities and index
 * Note: Currently only preparing variants.
 * @param args
 */
const updateStudy = async (args: { song: SongClient; score: ScoreClient; studyId: string }): Promise<void> => {
	const { song, score, studyId } = args;

	/**
	 * 1. Fetch all analyses for study
	 * 2. For Each analysis in repo, for each file in analysis:
	 * 3. Check if new file is VCF
	 * 4. Fetch VCF File
	 * 5. Parse VCF into variants
	 * 6. Index Variants
	 * * Note: Long term plan is to store Analyses, Files, and Variants in DB, mark updated entities and trigger the indexing process.
	 * In order to complete short term objectives, we'll just parse the variants and index as listed in steps.
	 */

	const pageGenerator = song.fetchAllAnalysisPages({
		filters: {
			states: ['PUBLISHED', 'UNPUBLISHED', 'SUPPRESSED'],
			study: studyId,
		},
	});

	for await (const page of pageGenerator) {
		logger.debug(`Retrieved analysis page`, { analyses: page.currentTotalAnalyses, total: page.totalAnalyses });
		for (const analysis of page.analyses) {
			// TODO: Check file for updates and store in DB

			await updateAnalysis({ analysis, song, score });
		}
	}
};

/**
 * Fetch and index entities from repository
 * This will initiate the updateStudy method for every available study, filtered by studies in the arguments.
 *
 * @param repo
 * @returns
 */
async function updateRepository(repo: Repository, filters: { studies?: string[] } = {}): Promise<void> {
	logger.info(repo.code, 'Starting updates for repo', filters);

	const song = new SongClient({ host: repo.songUrl });
	const score = new ScoreClient({ host: repo.scoreUrl });

	const studiesResult = await song.fetchAllStudies();
	if (!studiesResult.success) {
		logger.error(repo.code, 'Aborting update', 'Error fetching studies', studiesResult.message);
		return;
	}
	// const studies = studiesResult.data;
	logger.info(repo.code, 'Available studies', studiesResult.data);
	const studiesToFilter = filters.studies
		? filters.studies.filter((study) => studiesResult.data.includes(study))
		: studiesResult.data;
	logger.info('Studies to update', studiesToFilter);

	for (const studyId of studiesToFilter) {
		await updateStudy({ song, score, studyId });
	}

	logger.info(repo.code, 'Finished');
	return;
}

export default updateRepository;
