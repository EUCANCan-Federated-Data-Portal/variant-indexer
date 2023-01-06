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
import { z as zod } from 'zod';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch-commonjs';
import config from '../../config';
import Logger from '../../logger';
import { failure, Result, success } from '../../types/Result';
import { appendQueryParams, createUrl } from '../../utils/urlUtils';

const logger = Logger('Ego');

export const urls = {
	applicationAuth: createUrl(config.auth.ego.host, '/oauth/token'),
	checkApiKey: createUrl(config.auth.ego.host, '/o/check_api_key'),
	publicKey: createUrl(config.auth.ego.host, '/oauth/token/public_key'),
};

export type EgoApplicationCredential = {
	clientId: string;
	clientSecret: string;
};

// Matches response format for ego application auth requests for Ego @ 5.4.0
const EgoApplicationToken = zod.object({
	access_token: zod.string(),
	token_type: zod.string(),
	scope: zod.string(),
	expires_in: zod.number(),
});
type EgoApplicationToken = zod.infer<typeof EgoApplicationToken>;

/**
 * POST to /oauth/token/public_key with application id and secret as x-www-form-urlencoded content
 * @param appCredentials
 * @returns
 */
const getApplicationJwt = async (appCredentials: EgoApplicationCredential): Promise<Result<EgoApplicationToken>> => {
	const queryParams = {
		grant_type: 'client_credentials',
	};
	const url = appendQueryParams(urls.applicationAuth, queryParams);

	const bodyContent = { client_id: appCredentials.clientId, client_secret: appCredentials.clientSecret };
	const body = Object.entries(bodyContent)
		.map((entry) => `${encodeURIComponent(entry[0])}=${encodeURIComponent(entry[1])}`)
		.join('&');

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body,
	});

	if (!response.ok) {
		return failure(`Auth request failed with non-200 response: ${response.status} ${response.statusText}`);
	}

	const authResult = EgoApplicationToken.safeParse(await response.json());
	if (!authResult.success) {
		// FYI: This shouldn't occur, it indicates that the response from ego is different than expected when this was coded.
		return failure(`Auth request failed: ${authResult.error}`);
	}

	return success(authResult.data);
};

const getPublicKey = async (): Promise<string> => {
	const response = await fetch(urls.publicKey);

	if (!response.ok) {
		throw new Error(`Ego public key fetch failed with non-200 response: ${response.status} ${response.statusText}`);
	}

	return await response.text();
};

/**
 * Store singleton reference to our EgoClient.
 * This lets the getEgoToken method store the latest retrieved ego token
 */
type EgoClient = {
	getAuth: () => Promise<Result<string>>;
};

let authClient: EgoClient;

/**
 * Retrieve the current stored ego token, or fetch a new one if the current stored token is expired.
 * This uses the ego credentials from the global config, retrieved from vault
 * @returns
 */
export const getEgoToken = async (): Promise<Result<string>> => {
	if (!authClient) {
		await createAuthClient();
	}
	return authClient.getAuth();
};

const createAuthClient = async () => {
	let latestJwt: string;

	const publicKey = await getPublicKey();

	const appCredentials = {
		clientId: config.auth.ego.credentials.id,
		clientSecret: config.auth.ego.credentials.secret,
	} satisfies EgoApplicationCredential;

	const getAuth = async (): Promise<Result<string>> => {
		if (latestJwt && jwt.verify(latestJwt, publicKey, { algorithms: ['RS256'] })) {
			return success(latestJwt);
		}
		logger.debug(`Fetching new token from ego...`);
		const jwtResult = await getApplicationJwt(appCredentials);
		if (!jwtResult.success) {
			return jwtResult;
		}
		latestJwt = jwtResult.data.access_token;
		return success(latestJwt);
	};

	authClient = {
		getAuth,
	};
};
