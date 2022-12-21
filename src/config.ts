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
import npmPackage from '../package.json';
import { KafkaConsumerConfiguration } from './external/kafka/types';
import env from './utils/envUtils';

const songConsumer: KafkaConsumerConfiguration = {
	topic: env('KAFKA_TOPIC_SONG').string('song_analysis'),
	group: env('KAFKA_CONSUMER_SONG_GROUP').string('song_analysis'),
	dlq: env('KAFKA_CONSUMER_SONG_DLQ').boolean(true),

	// If heartbeat is provided, it is required to be a number, otherwise it will be undefined.
	heartbeatInterval: process.env.KAFKA_CONSUMER_SONG_HEARTBEAT_INTERVAL
		? env('KAFKA_CONSUMER_SONG_HEARTBEAT_INTERVAL').required().number()
		: undefined,
};

const isProduction = env('NODE_ENV').matches('production');
const isTest = env('TEST_MODE').boolean(false);
const config = {
	env: {
		isProduction,
		isTest,
		isDev: !(isTest || isProduction),
		version: env('BUILD_VERSION').string(npmPackage.version),
	},
	auth: {
		ego: {
			host: env('EGO_HOST', 'URL for Ego Auth API ex. http://ego.ui').required().string(),
			credentials: {
				id: env('EGO_CLIENT_ID').required().string(),
				secret: env('EGO_CLIENT_SECRET').required().string(),
			},
		},
	},
	db: {
		host: env('PG_HOST').required().string(),
		port: env('PG_PORT').required().number(),
		user: env('PG_USER').required().string(),
		pass: env('PG_PASS').required().string(),
		db: env('PG_DB').required().string(),
	},
	es: {
		host: '',
		user: '',
		pass: '',
	},
	logs: {
		level: env('LOG_LEVEL').options(['debug', 'info', 'warning', 'error']).string('info'), // log level used in deployed app
	},
	kafka: {
		brokers: [env('KAFKA_BROKER').required().string()] as string[],
		clientId: env('KAFKA_CLIENT_ID').string('indexer'),
		namespace: env('KAFKA_NAMESPACE').string('indexer'),
		consumers: {
			song: songConsumer,
		},
		producers: {
			indexing: { topic: env('KAFKA_INDEXING_TOPIC') },
		},
	},
	server: {
		port: env('SERVER_PORT').number(3344),
	},
} as const;

export default config;
