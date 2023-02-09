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

import QueryString from 'qs'; // Included from and used by express to parse query string params
import { isArray } from 'lodash';
import { failure, Result, success } from '../types/Result';

/**
 * Returns query param value as an array, if possible.
 * Single string values will be returned as an array with that single entry.
 * Result failures will be returned if the value is undefined, empty string, or a nested query object
 * @param value
 * @returns
 */
export function parseQueryArray(
	value: undefined | string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
): Result<string[]> {
	// only deal with arrays (and value defined)
	if (!value) {
		//undefined or empty string
		return failure('No value provided');
	}
	if (!isArray(value)) {
		if (typeof value === 'object') {
			// query value is ParsedQs object
			return failure('Value provided is an nested query object');
		}
		// single string given, return as array
		return success([value]);
	}

	// validate all elements are strings
	if (value.map((x: string | QueryString.ParsedQs) => typeof x === 'string').every((item) => item)) {
		return success(value as string[]);
	}
	return failure('Value is an array that includes nested values instead of strings');
}
