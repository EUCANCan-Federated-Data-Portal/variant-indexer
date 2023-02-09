# Docker Compose

A [`docker-compose`](../../docker-compose.yaml) file has been provided to allow developers to run local instances of all services that the indexer connects to.

> **Makefile**
> 
> A makefile in this repo includes scripts to simplify running the docker environment. 
>
> Run `make up` to start all docker containers through docker-compose. Similarly, `make down` will stop all containers. 
>
> Reference the [`Makefile`](makefile.md) documentation for more control scripts available.



## Containers

Links to docker resources:

| Container     | Port(s) | API Docs                                         |
| ------------- | ------- | ------------------------------------------------ |
| Ego           | 8081    | [Swagger](http://localhost:8081/swagger-ui.html) |
| Score         | 8082    | [Swagger](http://localhost:8082/swagger-ui.html) |
| Song          | 8083    | [Swagger](http://localhost:8083/swagger-ui.html) |
| Rollcall      | 8084    | [Swagger](http://localhost:8084/swagger-ui.html) |
| Minio         | 9000    | [Minio](http://localhost:9000/minio)             |
| Elasticsearch | 9200    | [Elasticsearch](http://localhost:9200)           |

### Postgres
One Postgres DB container is included, and this single DB is configured to be used by all dependencies that rely on a Postgres instance. Sharing this one container was done to reduce the load on developer computers.

The directory [./docker](../../docker) includes init scripts for some of these data bases in order to prepopulate the applications with data that is useful for development testing. Example: Ego is setup with an application already available to provide auth credentials to the indexer.

> NOTE:
> 
### Ego
Provides auth credentials for this application and also for Song/Score dependencies.

Connects to common Postgres container. An [init script](../../docker/ego/init.sql) is included to prepopulate the DB with an application to provide auth credentials to this application:

|                   |               |
| ----------------- | ------------- |
| **Name**          | indexer       |
| **client_id**     | indexer       |
| **client_secret** | indexersecret |

### Elasticsearch

WIP Placeholder

### Rollcall
Rollcall is an overture product to manage versioning ES Indices and Aliases.

Managed Aliases:
| Alias             | Entity Name | Entity Type | ES Link                                       |
| ----------------- | ----------- | ----------- | --------------------------------------------- |
| `variant_centric` | `variant`   | `centric`   | http://localhost:9200/variant_centric/_search |

### Minio
Object Storage provider used by Score, providing an API matching the AWS S3 API. Has a [web portal](http://localhost:9000/minio) to browse stored contents that can be accessed using dummy access/secret key pair configured in docker compose:

|                |          |
| -------------- | -------- |
| **access key** | minio    |
| **secret key** | minio123 |