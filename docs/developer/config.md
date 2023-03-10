# Config

Configuration for this application is managed through environment variables. 

## Development Env Variables
This application reads configuration variables from the file [`.env`](./../../.env). This file is not included in the git repo and needs to be created by the developer before running the application

[`.env.template`](../../.env.template) is a template for the contents of the `.env` file. The default values provided are defined to connect to the docker containers as defined in the `docker-compose` setup. Many variables are commented out with `#` to start the line - these represent optional variables and you do not need to provide this value to run the application.

> **dotenv**
> 
> The values in the `.env` file are read into `process.env` thanks to the [`dotenv`](https://www.npmjs.com/package/dotenv) library.

### Create .env file
Create a local .env file from the provided template:
```bash
cp .env.template .env
```

## Env Variables

> **Note**: When a default value is listed here for a required field, this represents the default provided by the template. If you omit this value in your `.env` file the application will not run. Default values in optional fields are provided by the application code in [`src/config.ts`](../../src/config.ts).
>
> This document is a guide and is not guaranteed to match 100% the content of `.env.template` or the `src/config.ts`. Always check those files in case of a discrepency (and please open a PR to correct any mismatches).

| Variable Name                   |               Required                | Type                                |          Default | Description                                                                                                                                                                                                                     |
| ------------------------------- | :-----------------------------------: | ----------------------------------- | ---------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SERVER_PORT`                   |               Optional                | number                              |           `3344` | The port that the application will listen to for incoming web traffic                                                                                                                                                           |
| `LOG_LEVEL`                     |               Optional                | `debug`, `info`, `warning`, `error` |           `info` | The minimum log level that will be output when the application runs in production. <br/>_Note: this property only has an effect in production (`NODE_ENV=='production'`). In dev, the log level is always debug._               |
| `NODE_ENV`                      |               Optional                | `production`, `development`         |    `development` | Express framework standard that impacts logging behaviour.                                                                                                                                                                      |
| `TEST_MODE`                     |               Optional                | boolean                             |          `false` | When `true`, silences all logging. Set to `true` by the test scripts.                                                                                                                                                           |
|                                 |                                       |                                     |                  |                                                                                                                                                                                                                                 |
| `ES_AUTH_ENABLED`                  | Optional | boolean                              | `false` | Enable the application to use Basic Authentication when connecting to Elasticsearch                                                                                                                                                                                                            |
| `ES_HOST`                  | Required | string                              | `http://localhost:9200` | Elasticsearch host connection URL including protocol (http) and port (9200).                                                                                                                                                                                                            |
| `ES_USER`                  | Required when `ES_AUTH_ENABLED` | string                              | - | Username for elasticsearch authentication.                                                                                                                                                                                                            |
| `ES_PASSWORD`                  | Required when `ES_AUTH_ENABLED` | string                              | - | Password for elasticsearch authentication.                                                                                                                                                                                                            |
| `ES_VARIANT_CENTRIC_INDEX`                  | Optional | string                              | `variant_centric` | Name to use for variant centric index                                                                                                                                                                                                            |
|                                 |                                       |                                     |                  |                                                                                                                                                                                                                                 |
| `KAFKA_BROKER`                  | Required when `FEATURE_KAFKA_ENABLED` | string                              | `localhost:9092` | URL to kafka broker.                                                                                                                                                                                                            |
| `KAFKA_CLIENT_ID`               |               Optional                | string                              |        `indexer` | Client ID used to identify this applciation with the Kafka Broker. Must be unique for applications connecting to this Kafka Broker.                                                                                             |
| `KAFKA_NAMESPACE`               |               Optional                | string                              |        `indexer` | Prefix added to Kafka consumer names and topics generated by this application.                                                                                                                                                  |
| `KAFKA_TOPIC_SONG`              |               Optional                | string                              |  `song_analysis` | Topic name that song will deliver messages to about new Analyses and updates to analysis states. Default value matches the Song default topic name.                                                                             |
| `KAFKA_CONSUMER_SONG_GROUP`     |               Optional                | string                              |  `song_analysis` | Identifier for the consumer group name that will read from the `KAFKA_TOPIC_SONG`. The consumer group will be prefixed with the `KAFKA_NAMESPACE`.                                                                              |
| `KAFKA_CONSUMER_SONG_DLQ`       |               Optional                | boolean                             |           `true` | Whether or not to send failed reads from the `KAFKA_TOPIC_SONG` to a DLQ for future processing.                                                                                                                                 |
| `KAFKA_CONSUMER_SONG_HEARTBEAT` |               Optional                | number                              |                - | If set, overrides the default kafka heartbeat duration (3s) for the `KAFKA_TOPIC_SONG` topic consumer.                                                                                                                          |
|                                 |                                       |                                     |                  |                                                                                                                                                                                                                                 |
| `PG_HOST`                       |               Required                | string                              |      `localhost` | Hostname for the PostgresDB                                                                                                                                                                                                     |
| `PG_PORT`                       |               Required                | number                              |           `8432` | Port to connect to PostgresDB on the `PG_HOST`                                                                                                                                                                                  |
| `PG_USER`                       |               Required                | string                              |       `postgres` | Username to use to connect to PostgresDB                                                                                                                                                                                        |
| `PG_PASS`                       |               Required                | string                              |       `password` | Password for `PG_USER` to use to connect to PostgresDB                                                                                                                                                                          |
| `PG_DB`                         |               Required                | string                              |        `indexer` | Database to connect to on PostgresDB                                                                                                                                                                                            |
|                                 |                                       |                                     |                  |                                                                                                                                                                                                                                 |
| `EGO_HOST`                      |               Required                | string                              |                - | URL to connect to Ego API **NOT SETUP IN DOCKER COMPOSE**                                                                                                                                                                       |
| `EGO_CLIENT_ID`                 |               Required                | string                              |                - | ClientID of application registered in Ego with permissions to read from Song/Score **NOT SETUP IN DOCKER COMPOSE**                                                                                                              |
| `EGO_CLIENT_ID`                 |               Required                | string                              |                - | Client Secret of application registered in Ego with permissions to read from Song/Score **NOT SETUP IN DOCKER COMPOSE**                                                                                                         |
| `EGO_AUTH_POLICY`               |               Optional                | string                              |        `INDEXER` | Ego policy that is required in JWT Scopes for restricted APIs.                                                                                                                                                                  |
|                                 |                                       |                                     |                  |                                                                                                                                                                                                                                 |
| `SONG_HOST`                     |               Required                | string                              |                - | WIP **NOT SETUP IN DOCKER COMPOSE**                                                                                                                                                                                             |
| `SONG_ENV`                      |               Required                | string                              |                - | WIP **NOT SETUP IN DOCKER COMPOSE**                                                                                                                                                                                             |
| `SONG_CONCURRENT_REQUESTS`      |               Required                | string                              |                - | WIP **NOT SETUP IN DOCKER COMPOSE**                                                                                                                                                                                             |
| `SONG_PAGE_SIZE`                |               Required                | string                              |                - | WIP **NOT SETUP IN DOCKER COMPOSE**                                                                                                                                                                                             |
|                                 |                                       |                                     |                  |                                                                                                                                                                                                                                 |
| `FEATURE_DEV_AUTH_BYPASS`       |               Optional                | boolean                             |            false | **FEATURE FLAG**: When enabled, authorization middleware will accept all requests. As an extra precaution, this feature will not work when `NODE_ENV=='production'`. This is to make testing in local dev environments simpler. |
| `FEATURE_KAFKA_ENABLED`         |               Optional                | boolean                             |            false | **FEATURE FLAG**: When enabled, server will require kafka configuration and listen to kafka for actions to take.<br/><br/>Without Kafka, index updates will only occur when requested through the API.                          |
| `FEATURE_LEGACY_SONG`         |               Optional                | boolean                             |            false | **FEATURE FLAG**: When enabled, the old Song API which returns every analysis for a study without pagination will be used. Enable this when connecting to Song with version < `4.8.0` .                          |

## Adding Env Variables

To add a new environment variable to the repository requires making the following changes:
1. Add the new environment variable to the [.env.template](../../.env.template) template
1. Add a new property to the global config in [/src/config.ts](../../src/config.ts) that will read from the new property.
1. Add the new variable to the Env Variables table in this document. 

If the variable is required, you will also need to update your `.env` file with the new variable.

For Feature Flags, the name of the environment variable must begin with `FEATURE_`.

### Updating the .env Template

When adding new variables to the .env template, please follow these rules:

  1. Keep the template organized by grouping related variables together in the template. Use headers to describe each group to help developers navigate the .env file.
  1. Required variables must include a default value that will work for a new developer running this application.
  1. Optional variables should be commented out and should include the default value used by the application.

The objective of the .env template is to provide a starting point for new developers. If configured correctly, a new developer should be able to run the application from source using a copy of this template and the docker-compose described services. In order to maintain this, default values in the template the direct to external resources should be written to connect to the docker-compose services.

### Adding Config Properties

Environment variables are all read into a global config object in the [/src/config.ts](../../src/config.ts) file. This is the entry point for environment variables into the source code. 

An [envUtils library](../../src/utils/envUtils.ts) is included in this repo to enforce type safety of environment variables on application startup. Looking at the existing config properties should give a good guide for how to use this library. This library will validate that the provided environment variable matches the provided type information, including if it is required or not, and throw an error if the provided value is not valid. This will prevent the application from starting if the `.env` variables do not match expectations for the application.

When adding new config properties, please use the `envUtils` library.

The library will create a variable validator from the name of the env variable:

```ts
env('VARIABLE_NAME')
```


By default, all variables are optional, you need to declare the type you expect the variable to be (`string`, `number`, or `boolean`) with a default value if the value is not provided:

```ts
env('VARIABLE_NAME').string('default');
env('VARIABLE_NAME').number(123);
env('VARIABLE_NAME').boolean(false);
```

If you need the variable to be provided in the `.env` file, chain the `.required()` function and no default value will be used:

```ts
env('VARIABLE_NAME').required().string();
```

You can require that the value provided is within a list of allowed values using the `.options()` method:

```ts
env('VARIABLE_NAME').options(['A','B','C']).string('C'); // If a value is provided it must be from the list otherwise an error is thrown. If no value is provided, this will default to `C`
env('VARIABLE_NAME').options(['1','2','3']).number(1); // provided value must match a string, but can be parsed into a number
env('VARIABLE_NAME').required().options(['A','B','C']).string(); // a value is required and must be in the list of options
```

Lastly, you can transform a value into a boolean using the `.matches()` method:

```ts
env('VARIABLE_NAME').matches('hello'); // returns true if the environment variable matched `hello`, otherwise false. If no value is provided it will return false. 
env('VARIABLE_NAME').required().matches('hello'); // If no value is provided this throws an error, otherwise we check if the value matches `hello`
```


### Adding Env Variables to this Document

Please [document](#adding-env-variables) all environment variables used by the application.

In order to simplify maintenance of this document, add all variables to the table in the same order that they appear in the `.env.template`. Where headers are used in the template, used blank lines in the table.

## Feature Flags

Some features in the application are disabled by default, but can be enabled by setting environment variables labeled as Feature Flags to true. There is a section header in the `.env.template` which contains these properties. All Feature Flag environment variables are prefixed with `FEATURE_`. To enable a feature, add it to your environment with the value `true`.

The features available in the application are summarized in the following sub-sections

### Feature: Dev Auth Bypass

Enable this to remove the requirement for Authorization on restricted end points. This is convenient for developers in a local context.

As an added precaution, if the server is running in production mode (`NODE_ENV=='production'`) This will not have any impact. When enabled, the server will print a warning in the logs every time a restricted endpoint is accessed.


### Feature: Kafka

The server can listen to a Kafka broker to automatically run index updates in response to data updates in Song. The application will automatically update or create entities based on the content of the Song Analysis in each message, and will then update the affected indices with these changes. 

Song has a built in feature to send messages to Kafka that can be enabled. By default it writes to a topic called `song_analysis`. That is the topic name provided by the default configuration of this application. Song sends notifications whenever an analysis is created or updated.

When enabled, it is required to provide conneciton details to a Kafka Broker in the `KAFKA_BROKER` environment variable.

If Kafka is not enabled, index updates will only be performed on request through the [Update API](src/../../../src/routes/v1/update.ts).