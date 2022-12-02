import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import type { Express } from 'express';

import getServer from '../../../src/server';

chai.use(chaiHttp);
let server: Express | undefined;

describe('Server', () => {
	before(async () => {
		server = await getServer();
	});
	it('get / - returns 200', (done) => {
		expect(true).to.be.true;
		chai
			.request(server)
			.get('/')
			.end((_err, res) => {
				expect(res.status.valueOf()).to.equal(200);
				done();
			});
	});
});
