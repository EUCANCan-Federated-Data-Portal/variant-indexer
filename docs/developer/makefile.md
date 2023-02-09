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

#### `make nuke`
Stops all running containers, removes those containers and all volumes. If you run this, you will lose all your stored dev data. This is helpful when you have pulled updates from upstream that include new versions of docker dependencies or new init scripts with additonal seed data for your containers, since removing all temp volumes will cause them to be recreated on your next docker-compose run using the updated init scripts.