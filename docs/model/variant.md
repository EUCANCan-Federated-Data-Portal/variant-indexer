# Variant

## ES Doc Structure

```ts
{
  "mutation_id": "MU12345",
  "reference_genome_assembly": "GRCh37",
  "genomic_dna_change": "chr1:g.32180498T>C",
  "chromosome": "chr1",
  "start_position": 32180498,
  "reference_allele": "T",
  "tumor_allele": "C",
  "variant_class": "SNV",
  "annotation": EnsembleVepTypes.Annotation[],
  "frequency" : EnsembleVepTypes.Frequency[],
  "occurrence": [
    {
      "submitter_donor_id": "",
      "gender": "",
      "primary_site": "",
      "vital_status": "",
      "survival_time": "",
      "cause_of_death": "",
      "primary_diagnosis": [
        {
          "submitter_primary_diagnosis_id": "",
          "age_at_diagnosis": "",
          "cancer_type_code": "",
          "clinical_tumour_staging_system": "",
          "clinical_stage_group": "",
          "lymph_nodes_examined_status": "",
          "performance_status": "",
          "laterality": "",
          "treatment": [
            {
              "submitter_treatment_id": "",
              "treatment_type": "Chemotherapy",
              "treatment_intent": "",
              "treatment_start_interval": "",
              "treatment_duration": "",
              "response_to_treatment": "",
              "chemotherapy": [
                {
                  "drug_name": "drug1",
                  "drug_rxnormcui": "drug1_rxid",
                  "cumulative_drug_dosage": 2,
                  "chemotherapy_dosage_units": "IU/m2"
                }
              ]
            }
          ],
          "follow_up": [
            {
              "submitter_follow_up_id": "",
              "interval_of_followup": "",
              "disease_status_at_followup": "",
              "relapse_type": "",
              "submitter_treatment_id": ""
            }
          ]
        }
      ],
      "comorbidity": [
        {
          "age_at_comorbidity_diagnosis": "",
          "comorbidity_type_code": ""
        } 
      ],
      "demographic": {
        "updated_datetime": "2016-09-02T19:14:56.803257-05:00",
        "created_datetime": null,
        "gender": "male",
        "state": null,
        "demographic_id": "f4cf2cac-d680-5d01-8d61-d3e6cc0f152d",
        "year_of_birth": 1928,
        "race": "white",
        "submitter_id": "TCGA-G7-7502_demographic",
        "ethnicity": "not hispanic or latino",
        "year_of_death": null
      },
      "project": {
        "project_id": "",
        "disease_type": "Kidney Renal Papillary Cell Carcinoma",
        "released": true,
        "state": "ICGC-25k",
        "primary_site": "Kidney",
        "name": "Kidney Renal Papillary Cell Carcinoma"
      },      
      "summary": {
        "data_categories": [
          {
            "file_count": 5,
            "data_category": "Transcriptome Profiling"
          },
          {
            "file_count": 1,
            "data_category": "Biospecimen"
          },
          {
            "file_count": 13,
            "data_category": "Simple Nucleotide Variation"
          },
          {
            "file_count": 1,
            "data_category": "Clinical"
          },
          {
            "file_count": 4,
            "data_category": "Copy Number Variation"
          },
          {
            "file_count": 4,
            "data_category": "Raw Sequencing Data"
          }
        ]
      },
      "observation": [
        {
          "src_vcf_analysis_id": "4f1da1f2-5f99-4f42-a164-08e0c627ff54",
          "repository": "Collaboratory",
          "platform": "",
          "experimental_strategy": "",
          "read_depth": {
            "n_alt_count": 0,
            "n_ref_count": 117,
            "n_depth": 117,
            "t_alt_count": 19,
            "t_ref_count": 37,
            "t_depth": 56
          },
          "sample": {
            "submitter_sample_id": "SA601681",
            "matched_normal_submitter_sample_id": "SA602282",
            "sample_type": ""
          },
          "specimen": {
            "submitter_specimen_id": "",
            "submitter_primary_diagnosis_id": "",
            "specimen_acquisition_interval": "",
            "specimen_anatomic_location": "",
            "specimen_laterality": "",
            "tumour_histological_type": "",
            "pathological_tumour_staging_system": "",
            "pathological_stage_group": "",
            "tumour_grading_system": "",
            "tumour_grade": "",
            "percent_tumour_cells": "",
            "specimen_tissue_source": "",
            "specimen_type": "",
            "tumour_normal_designation": ""
          },
          "workflow": {
            "workflow_name": "",
            "workflow_version": "",
            "variant_caller": ["muse"]
          },
          "input_files": {
            "tumor_analysis_id": "1faceacb-9e69-4d10-b47e-22e946211db2",
            "normal_analysis_id": "f7d28d33-d7fe-43d4-aa92-7394929a6167"
          }
        }
      ]
    }
  ],
  "gene": [
    {
      "gene_chromosome": "1",
      "gene_start": 32179686,
      "gene_end": 32198285,
      "gene_strand": 1,
      "symbol": "TXLNA",
      "name": "",
      "synonyms": [
        "DKFZp451J0118"
      ],
      "description": "",
      "biotype": "",
      "is_cancer_gene_census": null,
      "ensembl_gene_id": "", 
      "cytoband": [
        "1p35.2"
      ],
      "hgnc_gene_id": "",
      "cosmic_gene_id": "",
      "entrez_gene_id": "",
      "omim_gene_id": ""
    }
  ]
}
```