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

function requiredEnvBuilder(props: { key: string; value: string; description?: string }) {
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
				throw new EnvError({ error: 'Provided value cannot be parsed as a boolean', key, value: process.env[key] });
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
	 * @param expected
	 * @returns
	 */
	function matches(expected: string): boolean {
		const value = process.env[key];
		return expected === process.env[key];
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

function envBuilder(key: string, description?: string) {
	const value = process.env[key];

	const required = () => {
		const value = process.env[key];
		if (value === undefined) {
			throw new EnvError({ error: 'Value is required', description, key, value });
		}
		return requiredEnvBuilder({ key, value, description });
	};

	const options = (options: string[]) => {
		const value = process.env[key];

		// undefined must be added to options list the value could be optional
		const optionsWithUndefined = [...options, undefined];
		if (!optionsWithUndefined.includes(value)) {
			throw new EnvError({ value, key, description, error: `Value must be one of ${JSON.stringify(options)}` });
		}
		return _this();
	};

	const boolean = (defaultTo: boolean): boolean => {
		const value = process.env[key];
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
		const value = process.env[key];
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
		const value = process.env[key];
		return value === undefined ? defaultTo : value;
	}

	/**
	 * Returns true if the env value matches the given string
	 * @param expected
	 * @returns
	 */
	function matches(expected?: string): boolean {
		return expected === process.env[key];
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

const env = envBuilder;
export default env;
