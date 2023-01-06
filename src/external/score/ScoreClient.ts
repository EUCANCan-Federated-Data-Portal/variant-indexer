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

import fetch from 'node-fetch-commonjs';

import { failure, Result, success } from '../../types/Result';
import Logger from '../../logger';
import { appendQueryParams, createUrl } from '../../utils/urlUtils';
import { getEgoToken } from '../ego';
import { unknownToString } from '../../utils/stringUtils';
import { ScoreResponseGetDownload } from './types';
const logger = Logger('ScoreClient');

class ScoreClient {
	host: string;

	constructor(config: { host: string }) {
		this.host = config.host;
	}

	async fetchDownloadUrl(details: { objectId: string; fileLength: number }): Promise<Result<ScoreResponseGetDownload>> {
		const url = createUrl(this.host, 'download', details.objectId);
		const urlWithQuery = appendQueryParams(url, {
			offset: 0,
			length: details.fileLength,
			external: true,
		});

		try {
			const tokenResult = await getEgoToken();
			if (!tokenResult.success) {
				return failure(`Could not retrieve auth token`, tokenResult.message);
			}

			const authHeader = `Bearer ${tokenResult.data}`;

			const scoreResponse = await fetch(urlWithQuery, {
				headers: {
					Authorization: authHeader,
				},
			});
			if (!scoreResponse.ok) {
				return failure(`Score.fetchDownloadUrl response not ok`, scoreResponse.status, scoreResponse.statusText);
			}

			const content = await scoreResponse.json();
			const responseResult = ScoreResponseGetDownload.safeParse(content);
			if (!responseResult.success) {
				logger.debug(`Invalid response from Score.fetchDownloadUrl`, scoreResponse.text(), responseResult.error.issues);
				return failure(`Invalid response from Song fetchDownloadUrl`, responseResult.error.issues);
			}
			return success(responseResult.data);
		} catch (error) {
			return failure(unknownToString(error));
		}

		// const scoreUrl = `${dataCenter.scoreUrl}/download/${fileObjectId}?offset=0&length=${fileSize}&external=true`;
		// const scoreResponse = await fetch(scoreUrl, {
		// 	headers: {
		// 		Authorization: `Bearer ${scoreProxyJwt}`,
		// 	},
		// })
		// 	.then((response) => response.json())
		// 	.catch((err) => {
		// 		logger.error('Score Router Error - ' + err);
		// 		return res.status(500).end();
		// 	});
		// const scoreDownloadUrl = get(scoreResponse, 'parts[0].url', undefined);
		// if (!scoreDownloadUrl) {
		// 	// if we get here, the score response didn't contain a download url
		// 	return res.status(404).end();
		// }
		// // download file from score and return it to the client with the correct filename
	}

	async streamFile(details: { objectId: string; fileLength: number }): Promise<Result<NodeJS.ReadableStream>> {
		try {
			const urlResult = await this.fetchDownloadUrl(details);
			if (!urlResult.success) {
				return failure('Unable to download file due to issue requesting download URL', urlResult.message);
			}

			const downloadParts = urlResult.data.parts;
			if (downloadParts.length !== 1) {
				return failure('Score provided unexpected number of download parts', downloadParts.length);
			}

			const downloadUrl = downloadParts[0].url;
			const downloadResponse = await fetch(downloadUrl);

			if (!downloadResponse.ok) {
				return failure(`Score.streamFile response not ok`, downloadResponse.status, downloadResponse.statusText);
			}

			if (downloadResponse.body === null) {
				return failure(`Score.streamFile response is null`);
			}

			return success(downloadResponse.body);
		} catch (error) {
			return failure(unknownToString(error));
		}
	}
}

export default ScoreClient;
