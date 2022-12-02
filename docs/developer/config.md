# Config

Configuration for this application is managed through environment variables. 

## Development Env Variables
This application reads configuration variables from the file [`.env`](./../../.env). This file is not included in the git repo and needs to be created by the developer before running the application

[`.env.schema`](../../.env.schema) is a template for the contents of the [`.env`](./../../.env) file. The values provided are defined to connect to the docker containers as defined in the `docker-compose` setup.

Before running the application, copy the contents of 

> **dotenv**
> 
> The values in the `.env` file are read into `process.env` thanks to the [`dotenv`](https://www.npmjs.com/package/dotenv) library.