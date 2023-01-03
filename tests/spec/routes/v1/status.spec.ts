import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import type { Express } from 'express';

import getServer from '../../../../src/server';

chai.use(chaiHttp);
let server: Express | undefined;

describe('Route - Status', () => {
	before(async () => {
		server = await getServer();
	});

	it('get /v1/status - returns 200 with status data', (done) => {
		chai
			.request(server)
			.get('/v1/status')
			.end((_err, res) => {
				expect(res.status.valueOf()).to.equal(200);
				const body = res.body;
				expect(body).to.have.all.keys('status', 'uptime', 'version');
				expect(body.status).to.have.all.keys('db', 'server');
				done();
			});
	});
});
