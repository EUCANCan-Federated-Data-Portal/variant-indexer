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

import { Client } from '@elastic/elasticsearch';
import { IndicesIndexSettings, MappingTypeMapping } from '@elastic/elasticsearch/api/types';
import config from '../../config';
import Logger from '../../logger';
const logger = Logger('Elasticsearch');

logger.debug({
	node: config.es.host,

	auth: config.es.authEnabled
		? {
				username: config.es.user ? '********' : undefined,
				password: config.es.pass ? '********' : undefined,
		  }
		: undefined,
});
const esClient = new Client({
	node: config.es.host,
	// Transport: TransportIncludingSubPath,
	auth: config.es.authEnabled
		? {
				username: config.es.user,
				password: config.es.pass,
		  }
		: undefined,
});

export const checkIndexExists = async (index: string): Promise<boolean> => {
	try {
		await esClient.indices.get({
			index,
		});
		logger.debug(index, `Index exists`);
		return true;
	} catch (e) {
		if (e instanceof Error && e.name === 'ResponseError' && e.message.startsWith('index_not_found_exception')) {
			logger.debug(index, `Index doesn't exist`);
			return false;
		}

		logger.error(`Error checking es for index ${index}`, e);
		throw e;
	}
};

export const createIndex = async (
	name: string,
	options: { mappings?: MappingTypeMapping; settings?: IndicesIndexSettings } = {},
): Promise<void> => {
	esClient.indices.create({
		index: name,
		body: {
			mappings: options.mappings,
			settings: options.settings,
		},
	});
	logger.info(name, `Index created`);
};

export default esClient;
