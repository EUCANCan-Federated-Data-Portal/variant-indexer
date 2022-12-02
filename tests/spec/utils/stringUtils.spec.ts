import { describe } from 'mocha';
import { expect } from 'chai';
import { unknownToString } from '../../../src/utils/stringUtils';

describe('String Utils', () => {
	describe('unknownToString', () => {
		it(`should return string unchanged`, () => {
			const value = 'test message';
			expect(unknownToString(value)).to.equal(value);
		});
		it(`should return message of Error as string`, () => {
			expect(unknownToString(new Error('test message'))).to.equal('test message');
		});
		it(`should convert object to string`, () => {
			const object = { a: 1 };
			const array = [object, 1, undefined];
			expect(unknownToString(object)).to.equal(JSON.stringify(object));
			expect(unknownToString(array)).to.equal(JSON.stringify(array));
		});
	});
});
