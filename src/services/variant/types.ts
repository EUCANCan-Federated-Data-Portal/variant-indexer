import { Variant } from 'vcf-extraction';
import { EnsembleVepAnnotation } from 'vcf-extraction/dist/extensions/ensembleVep/types';

export type VCFVariant = Variant & EnsembleVepAnnotation;
export type VariantDocAnnotation = {
	aa_change?: string;
	amino_acids_reference?: string;
	amino_acids_variant?: string;
	biotype?: string;
	canonical?: boolean;
	ccds?: string;
	cdna_position?: number;
	cdna_length?: number;
	cds_position?: number;
	cds_length?: number;
	clin_sig?: string;
	coding_dna_change?: string;
	codons_reference?: string;
	codons_variant?: string;
	consequence?: string[];
	cosmic?: string[];
	dbsnp?: string[];
	domains?: string;
	ensembl_gene_id?: string;
	ensembl_feature_id?: string;
	exon_rank?: number;
	exon_total?: number;
	feature_type?: string;
	feature_strand?: string;
	gene_pheno?: number;
	gene_symbol?: string;
	hgvsc?: string;
	hgvsp?: string;
	high_inf_pos?: string;
	intron_rank?: number;
	intron_total?: number;
	mane_plus_clinical?: string;
	mane_select?: string;
	motif_name?: string;
	motif_pos?: number;
	motif_score_change?: number;
	polyphen_impact?: string;
	polyphen_score?: number;
	protein_position?: number;
	protein_length?: number;
	pubmed?: string[];
	sift_impact?: string;
	sift_score?: number;
	transcription_factors?: string[];
	uniparc?: string;
	uniprotkb_swissprot?: string;
	uniprotkb_trembl?: string;
	vep_impact?: string;
};
export type VariantDoc = {
	mutation_id: string;
	reference_genome_assembly: string;
	genomic_dna_change: string;
	chromosome: string;
	start_position: number;
	reference_allele: string;
	tumor_allele?: string;
	variant_class?: string;
	annotation: VariantDocAnnotation[];
};
