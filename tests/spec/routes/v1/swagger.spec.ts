import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import type { Express } from 'express';

import getServer from '../../../../src/server';

chai.use(chaiHttp);
let server: Express | undefined;

describe('Route - Swagger', () => {
	before(async () => {
		server = await getServer();
	});

	it('get /v1/api-docs - no errors', (done) => {
		chai
			.request(server)
			.get('/v1/api-docs')
			.end((err, _res) => {
				expect(err).to.be.null;
				done();
			});
	});
});
