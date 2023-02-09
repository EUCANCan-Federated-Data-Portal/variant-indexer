# Quick Start Guide

## Running with docker-compose
1. `npm ci` - Install node dependencies from npm
   
2. `cp .env.template .env` - Create `.env` file from template
  
	See [config docs](./config.md) for more information on environment variable config. Copy `.env.template` file into a new file `.env` in the root directory of this project. The template has all default values needed to run this application connected to the containers as defined in the docker-compose file.

3. `docker-compose up -d` - Run docker compose

	For convenience, this can also be done with `make up`. Later you can stop all docker containers with `docker-compose down` or `make down`.

4. `npm run dev` - Start application with Node debug inspector available

## Connect Code Debugger

When the application is run using the `debug` script, Node opens a port for a debugger to interact with the running application. If you are using VS Code you can connect to the running process to debug the process:

With the app running,  open the command palette with `Cmd+Shift+P` (Windows `Ctl+Shift+P`). Search for and select the command `Debug: Attach to Node Process`, the debugger should connect to the running process.

You can also configure VS Code to automatically connect to Node applications when they are running. In the VS Code settings look for `Debug › JavaScript: Auto Attach Filter` and change this to value.

## Required Connections

When the server starts, required connections are checked and if they fail an error is thrown crashing the application. In order for the application to start it must successfully connect to:

* Elasticsearch
* Ego (unless FEATURE_DEV_AUTH_BYPASS=true to skip auth checks in dev)

## Feature Flags

Some functionality of the application is placed behind Feature Flags. These are enabled in the `.env` file. There is a section in the template that includes all available flags. Review the features you want to enable in the [Config](./config.md#feature-flags) docs.
