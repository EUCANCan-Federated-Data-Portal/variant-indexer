# Swagger API Docs

A Swagger page is available for the v1 API at `/v1/api-docs`. By default on localhost: [Swagger UI](http://localhost:3344/v1/api-docs)

The swagger UI router is defined at [/routes/v1/swagger.ts](../../src/routes/v1/swagger.ts).

The swagger documentation lives along side the routers in JSDocs, being parsed by [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc).

## Reference Documentation

Currently using openapi 3.0.3 . If newer versions are available, updating the version would be appreciated.

https://swagger.io/specification/

## Swagger JSDocs

In a JSDoc comment place an `@openapi` annotation, followed by yaml content that matches the swagger spec.

For Example, in [status.ts](../../src/routes/v1/status.ts):
```ts
/**
 * @openapi
 * /v1/status:
 *   get:
 *     tags:
 *       - Status
 *     name: Health Check
 *     description: Ping!
 *     responses:
 *       200:
 *         description: Respond 200 OK
 */
```

The library providing this functionality is [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc).

## Adding A New Router File

Each router file that has Swagger Docs needs to be added to the config of the [Swagger Router](../../src/routes/v1/swagger.ts), in the property `apis` . 

The entire directory of `./src/routes/*` has been included, so if the file is defined there no action is needed to get the JSDocs added to the swagger page. You may need to add your file to this config if it is stored in a different path.
