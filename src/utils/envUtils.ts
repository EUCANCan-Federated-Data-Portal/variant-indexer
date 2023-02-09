/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Error to throw when receiving invalid environment variable value
 */
export class EnvError extends Error {
	constructor(details: { error: string; key: string; value?: string; description?: string }) {
		const message = [
			`Invalid Environment Variable: ${details.error}`,
			`Key: ${details.key}`,
			`Value: ${details.value}`,
			details.description,
		].join(' - ');
		super(message);
	}
}

// TODO: JSDoc
function requiredValueValidator(props: { key: string; value: string; description?: string }) {
	let { key, description, value } = props;

	const options = (options: string[]) => {
		if (!(value && options.includes(value))) {
			throw new EnvError({ value, key, description, error: `Value must be one of ${JSON.stringify(options)}` });
		}
		return _this();
	};

	const boolean = (): boolean => {
		switch (value) {
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				throw new EnvError({ error: 'Provided value cannot be parsed as a boolean', key, value });
		}
	};

	const number = (): number => {
		const output = Number(value);
		if (isNaN(output) || ['', 'Infinity', '-Infinity'].includes(value)) {
			throw new EnvError({
				error: 'Value cannot be parsed as a number',
				description,
				key,
				value,
			});
		}
		return output;
	};
	const string = (): string => {
		return value;
	};

	/**
	 * Returns true if the env value matches the given string,
	 * @param {string} expected
	 * @returns
	 */
	function matches(expected: string): boolean {
		return expected === value;
	}

	const _this = () => ({
		options,

		boolean,
		number,
		string,
		matches,
	});

	return _this();
}

// TODO: JSDoc
function valueValidator(props: { key: string; value: string | undefined; description?: string }) {
	const { key, value, description } = props;
	const required = () => {
		if (value === undefined || value === '') {
			throw new EnvError({ error: 'Value is required', description, key, value });
		}
		return requiredValueValidator({ key, value, description });
	};

	const options = (options: string[]) => {
		// undefined must be added to options list the value could be optional
		const optionsWithUndefined = [...options, undefined];
		if (!optionsWithUndefined.includes(value)) {
			throw new EnvError({ value, key, description, error: `Value must be one of ${JSON.stringify(options)}` });
		}
		return _this();
	};

	const boolean = (defaultTo: boolean): boolean => {
		switch (value) {
			case 'true':
				return true;
			case 'false':
				return false;
			case undefined:
				return defaultTo;
			default:
				throw new EnvError({ error: 'Value cannot be parsed as a boolean', key, value, description });
		}
	};
	const number = (defaultTo: number): number => {
		if (value === undefined) {
			return defaultTo;
		}
		const output = Number(value);
		if (isNaN(output) || ['', 'Infinity', '-Infinity'].includes(value)) {
			throw new EnvError({ error: 'Value cannot be parsed as a number', key, value, description });
		}
		return output;
	};

	function string(defaultTo: string): string {
		return value === undefined ? defaultTo : value;
	}

	/**
	 * Returns true if the env value matches the given string
	 * @param {string} [expected]
	 * @returns {boolean}
	 */
	function matches(expected?: string): boolean {
		return expected === value;
	}

	const _this = () => ({
		options,
		required,

		boolean,
		number,
		string,
		matches,
	});

	return _this();
}

/**
 * envArray allows for an array of environment objects to retrieved from the .env file,
 * for example a list of users defined like:
 *
 * ```
 * USERS_0_NAME
 * USERS_0_EMAIL
 * USERS_1_NAME
 * USERS_1_EMAIL
 * ```
 *
 * You can use this method to retrieve a map of users that you can use the valueValidator on.
 *
 * Example:
 *
 * ```ts
 * const users = envArray('USERS').map(envObject => ({
 * 	name: envObject('NAME').string('Anonymous'),
 * 	email: envObject('EMAIL').required().string()
 * }));
 * ```
 *
 * Results in an array of 2 objects of type ({name: string, email: string}). This will also throw an error if a user
 * is provided in the .env file that is missing an email address.
 *
 * @param {string} key path of
 * @returns
 */
export function envArray(key: string) {
	// Regex to match key_[index][nextKey]
	const arrayRegex = new RegExp(`^${key}_(\\d+)_(\\w*)`);

	const arrayOfObjects = Object.entries(process.env)
		.map<[RegExpMatchArray | null, string | undefined]>((entry) => [entry[0].match(arrayRegex), entry[1]])
		.filter((entry): entry is [RegExpMatchArray, string | undefined] => entry[0] !== null)
		.map((entry) => {
			const index = entry[0][1]; //first match group is index
			const nextKey = entry[0][2];
			const value = entry[1];
			return { index, value, nextKey };
		})
		.reduce<Record<string, Record<string, string | undefined>>>((acc, entry) => {
			if (!acc[entry.index]) {
				acc[entry.index] = {};
			}
			acc[entry.index][entry.nextKey] = entry.value;
			return acc;
		}, {});

	const output = Object.values(arrayOfObjects).map(
		(envObject) => (key: string, description?: string) => valueValidator({ key, description, value: envObject[key] }),
	);

	return output;
}

const env = (key: string, description?: string) => {
	return valueValidator({ key, description, value: process.env[key] });
};
export default env;
