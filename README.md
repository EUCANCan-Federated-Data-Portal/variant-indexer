# EuCanCan Indexer Spike
Proof of concept multi-centric indexer

This application automates data indexing into ElasticSearch from Overture data sources ([Song](https://github.com/overture-stack/song) and [Score](https://github.com/overture-stack/score)), preparing mutliple entity-centric indices. The entities managed by this indexer, and the source of their data, include:

* Analyses - [Song](https://github.com/overture-stack/song)
* Files - [Song](https://github.com/overture-stack/song)
* Variants - [Song](https://github.com/overture-stack/song)/[Score](https://github.com/overture-stack/score) - Open VCF Files
* Genes - [Song](https://github.com/overture-stack/song)/[Score](https://github.com/overture-stack/score) - Open VCF File Annotations

## Standalone Vs Middleware
The indexer application can be run as a standalone server, including as a pre-built, dockerized application. In order to support extension, this can also be built as Express middleware. When added to an express server it can be configured as if standalone, but also given extensions to either:

1. programmatically modify the content of any entities
2. add additional triggers to update managed entities
3. add additional entities to the model

## Documentation
Documentation is included in markdown files in the [./docs](docs/README.md) directory.


