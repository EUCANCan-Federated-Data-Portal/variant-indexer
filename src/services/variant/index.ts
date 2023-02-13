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

import config from '../../config';
import esClient, { checkIndexExists, createIndex } from '../../external/elasticsearch';
import mappings from '../../resources/elasticsearch/variantCentricMapping';
import { Result, success, failure } from '../../types/Result';
import { VariantDoc, VariantDocAnnotation, VCFVariant } from './types';
import Logger from '../../logger';
import { EnsembleVepAnnotation } from 'vcf-extraction/dist/extensions/ensembleVep/types';
import { EnsembleVepTypes } from 'vcf-extraction/dist/extensions';
const logger = Logger('Service', 'Variant');

/**
 * Create Variant Centric index in Elasticsearch if it doesn't already exist.
 *
 * Will throw an error if unable to create index.
 */
export const initializeIndex = async (): Promise<void> => {
	const index = config.es.indices.variants.name;
	if (!(await checkIndexExists(index))) {
		logger.debug(`Creating variant centric index...`);
		await createIndex(index, { mappings });
	}
};

const buildVariantAnnotation = (annotation: EnsembleVepTypes.Annotation): VariantDocAnnotation => {
	return {
		...annotation,
		aa_change: [annotation.amino_acids_reference, annotation.protein_position, annotation.amino_acids_variant].join(''),
	};
};

/**
 * Convert Output of VCF Variant parser into variant entity for indexing.
 *
 * @param sampleId - Needed to generate unique `mutation_id`
 * @param variant
 * @returns
 */
export const convertVariantToDoc = (sampleId: string, variant: VCFVariant): Result<VariantDoc> => {
	if (variant.annotations.length === 0) {
		return failure('Ensemble Annotated Variant Data includes no annotation records');
	}
	if (variant.frequencies.length === 0) {
		return failure('Ensemble Annotated Variant Data includes no frequency records');
	}
	const variant_class = variant.annotations[0].variant_class; // Should be the same across all annotations for a single variant
	const doc: VariantDoc = {
		mutation_id: `${sampleId}_${variant.POS}`,
		reference_genome_assembly: 'GRCh37', // Fixed value - In future cases this may need a configuration based on workflows expected to be run
		genomic_dna_change: `${variant.CHROM}:${variant.POS}${variant_class}`,
		chromosome: variant.CHROM,
		start_position: variant.POS,
		reference_allele: variant.REF,
		tumor_allele: variant.ALT ? variant.ALT.filter((x) => !!x).join('') : undefined, // ALT can be an array somehow? we'll just join all parts after filtering out the empty entries
		variant_class,
		annotation: variant.annotations.map(buildVariantAnnotation),
	};
	return success(doc);
};

/**
 * Bulk index variant docs to elasticsearch. Done as an upsert so existing documents will be updated by ID.
 *
 * @param variants
 * @returns
 */
export const indexVariants = async (variants: VariantDoc[]): Promise<Result<undefined>> => {
	try {
		logger.info(`Beginning bulk upsert for ${variants.length} variants`);
		const body = variants.flatMap((variant) => [
			{ update: { _id: variant.mutation_id } },
			{ doc_as_upsert: true, doc: variant },
		]);

		const response = await esClient.bulk({
			index: config.es.indices.variants.name,
			body,
		});

		if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
			logger.info(`Variant indexing successful`);
			return success(undefined);
		} else {
			logger.error(`Error indexing variants`, response.body);
			return failure(response.body);
		}
	} catch (error) {
		logger.error(`Error thrown while indexing variants`, error);
		return failure(error);
	}
};
