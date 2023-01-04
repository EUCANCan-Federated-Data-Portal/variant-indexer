# Makefile

A [`Makefile`](../../Makefile) has been provided with some convenience scripts for developers. Scripts are provided to:

* Start Docker container dependencies
* Run the indexer from source

## Scripts

Run these scripts in your terminal from the root directory of this project.

### Run The Applicaiton

#### `make dev`
Start all docker containers and then run the indexer in debug mode.

### Manage Docker

#### `make up`
Start all docker containers

#### `make down`
Stop all docker containers

#### `make db`
Start only the Database containers:

* Postgres

#### `make es`
Start only the Elasticsearch related containers:

* Elasticsearch
* Rollcall (DB index management)

#### `make kafka`
Start only the Kafka related containers:

* Zookeper
* Broker

