import { describe } from 'mocha';
import { expect } from 'chai';
import env from '../../../src/utils/envUtils';

describe('Environment Utils', () => {
	before(() => {
		process.env = {
			TRUE: 'true',
			FALSE: 'false',
			STRING: 'string',
			EMPTY: '',
			FORTY_TWO: '42',
			ZERO: '0',
			NEGATIVE_ONE: '-1',
			// MISSING - reserved key because this is used as the value not provided in env
		};
	});

	it('should convert true and false to boolean values', () => {
		expect(env('TRUE').boolean(false)).to.be.true;
		expect(env('TRUE').required().boolean()).to.be.true;

		expect(env('FALSE').boolean(true)).to.be.false;
		expect(env('FALSE').required().boolean()).to.be.false;
	});

	it(`should throw error when boolean can't be parsed`, () => {
		expect(() => env('STRING').boolean(true)).to.throw();
		expect(() => env('STRING').required().boolean()).to.throw();
	});

	it('should parse numeric values correctly', () => {
		const fortyTwo = env('FORTY_TWO').required().number();
		expect(fortyTwo).to.equal(42);

		const zero = env('ZERO').required().number();
		expect(zero).to.equal(0);

		const negOne = env('NEGATIVE_ONE').required().number();
		expect(negOne).to.equal(-1);
	});

	it(`should throw error when number can\'t be parsed`, () => {
		expect(() => env('STRING').number(42)).to.throw();
		expect(() => env('STRING').required().number()).to.throw();
		expect(() => env('EMPTY').number(42)).to.throw();
	});

	it('should parse string values correctly', () => {
		const string = env('STRING').required().string();
		expect(string).to.equal('string');

		const zero = env('ZERO').required().string();
		expect(zero).to.equal('0');

		const stringTrue = env('TRUE').required().string();
		expect(stringTrue).to.equal('true');

		const negOne = env('NEGATIVE_ONE').required().string();
		expect(negOne).to.equal('-1');

		const empty = env('EMPTY').string('default');
		expect(empty).to.equal('');
	});

	it('should match value to return a boolean', () => {
		expect(env('STRING').matches('string')).to.be.true;
		expect(env('STRING').required().matches('string')).to.be.true;

		expect(env('STRING').matches('wrong')).to.be.false;
		expect(env('STRING').required().matches('wrong')).to.be.false;

		expect(env('MISSING').matches()).to.be.true;
	});

	it('should return default value when key is missing', () => {
		const envTrue = env('MISSING').boolean(true);
		expect(envTrue).to.be.true;

		const envFalse = env('MISSING').boolean(false);
		expect(envFalse).to.be.false;

		const envNum = env('MISSING').number(42);
		expect(envNum).to.equal(42);

		const envString = env('MISSING').string('fish');
		expect(envString).to.equal('fish');
	});

	it('should throw an error when required but value is missing', () => {
		expect(() => env('MISSING').required().boolean()).to.throw();
		expect(() => env('MISSING').required().number()).to.throw();
		expect(() => env('MISSING').required().string()).to.throw();
		expect(() => env('MISSING').required().matches('')).to.throw();
	});

	describe('options', () => {
		it('should return successfully if value is in options', () => {
			const bool = env('FALSE').options(['false']).boolean(true);
			expect(bool).to.equal(false);
			const num = env('FORTY_TWO').options(['41', '42', '43']).number(1);
			expect(num).to.equal(42);
			const string = env('STRING').options(['string', 'a', 'b', 'c']).string('default');
			expect(string).to.equal('string');

			// required options
			const required = env('STRING').required().options(['string', 'a', 'b', 'c']).string();
			expect(required).to.equal('string');
		});

		it('should return default when options are specified and value is missing', () => {
			const missing = env('MISSING').options(['string', 'a', 'b', 'c']).string('default');
			expect(missing).to.equal('default');
		});

		it('should throw error when value is missing in options', () => {
			expect(() => env('STRING').options(['a', 'b', 'c']).string('default')).to.throw();
			expect(() => env('STRING').required().options(['a', 'b', 'c']).string()).to.throw();
			expect(() => env('MISSING').options(['a', 'b', 'c']).required().string()).to.throw();
		});
	});
});
