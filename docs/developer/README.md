# Developer Documentation

To get started running this software on your development machine, follow the instructions in the [Quickstart](quickstart.md) docs.

## Contents

* [Config](config.md) - `.env` file contents
* [Docker Compose](docker-compose.md) - Local docker setup for developer and how to run it
* [Makefile](makefile.md) - Details on Makefile convenience scripts
* [Migrations](migrations.md) - Instructions for managing Postgres migrations
* [Quickstart](quickstart.md) - Instructions to run this software

## Dependencies
## Code
* [Node](https://nodejs.org/en/) - 18.12.0 - May work with others, this version is used for development and in the published docker image. To Install use [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating)
* [TypeScript](https://www.typescriptlang.org/docs/) - 4.9

## External Software

* [Postgres](https://www.postgresql.org/docs/) - 15
* [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/index.html) - 7.17
## Overture Software

* [Song](https://github.com/overture-stack/song) - 5.0.3 - [Docker Image](https://github.com/orgs/overture-stack/packages/container/package/song-server)
* [Score](https://github.com/overture-stack/score) - 5.8.1 - [Docker Image](https://github.com/orgs/overture-stack/packages/container/package/score-server)