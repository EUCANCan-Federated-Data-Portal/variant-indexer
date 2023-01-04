# Config

Configuration for this application is managed through environment variables. 

## Development Env Variables
This application reads configuration variables from the file [`.env`](./../../.env). This file is not included in the git repo and needs to be created by the developer before running the application

[`.env.template`](../../.env.template) is a template for the contents of the `.env` file. The values provided are defined to connect to the docker containers as defined in the `docker-compose` setup.

> **dotenv**
> 
> The values in the `.env` file are read into `process.env` thanks to the [`dotenv`](https://www.npmjs.com/package/dotenv) library.

### Create .env file
Create a local .env file from the provided template:
```bash
cp .env.template .env
```