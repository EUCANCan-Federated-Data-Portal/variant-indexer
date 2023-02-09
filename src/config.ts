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
import Repository from './types/Repository';
import { failure, Result, success } from './types/Result';
import env, { envArray } from './utils/envUtils';

const songConsumer: KafkaConsumerConfiguration = {
	topic: env('KAFKA_TOPIC_SONG').string('song_analysis'),
	group: env('KAFKA_CONSUMER_SONG_GROUP').string('song_analysis'),
	dlq: env('KAFKA_CONSUMER_SONG_DLQ').boolean(true),

	// If heartbeat is provided, it is required to be a number, otherwise it will be undefined.
	heartbeatInterval: process.env.KAFKA_CONSUMER_SONG_HEARTBEAT
		? env('KAFKA_CONSUMER_SONG_HEARTBEAT').required().number()
		: undefined,
};

const repositories: Repository[] = envArray('REPOSITORIES').map((envObject) => ({
	code: envObject('CODE').required().string(),
	country: envObject('COUNTRY').required().string(),
	name: envObject('NAME').required().string(),
	organization: envObject('ORGANIZATION').required().string(),
	scoreUrl: envObject('SCORE').required().string(),
	songUrl: envObject('SONG').required().string(),
}));

process.env.NODE_ENV = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;
const isProduction = env('NODE_ENV').matches('production');
const isTest = env('TEST_MODE').boolean(false);

const esAuthEnabled = env('ES_AUTH_ENABLED').boolean(false);

const featureDevAuthBypass = env('FEATURE_DEV_AUTH_BYPASS').boolean(false);
const featureKafkaEnabled = env('FEATURE_KAFKA_ENABLED').boolean(false);
const featureSongLegacy = env('FEATURE_LEGACY_SONG').boolean(false);

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
		policy: env('EGO_AUTH_POLICY').string('INDEXER'),
	},
	db: {
		host: env('PG_HOST').required().string(),
		port: env('PG_PORT').required().number(),
		user: env('PG_USER').required().string(),
		pass: env('PG_PASS').required().string(),
		db: env('PG_DB').required().string(),
	},
	es: {
		authEnabled: esAuthEnabled,
		host: env('ES_HOST').string(''),
		user: esAuthEnabled ? env('ES_USER').required().string() : '',
		pass: esAuthEnabled ? env('ES_PASSWORD').required().string() : '',
		indices: {
			variants: {
				name: env('ES_VARIANT_CENTRIC_INDEX').string('variant_centric'),
			},
		},
	},
	features: {
		authBypass: featureDevAuthBypass,
		kafka: featureKafkaEnabled,
		songLegacy: featureSongLegacy,
	},
	logs: {
		level: env('LOG_LEVEL').options(['debug', 'info', 'warning', 'error']).string('info'), // log level used in deployed app
	},
	kafka: {
		brokers: featureKafkaEnabled
			? env('KAFKA_BROKER', "Kafka Broker URL, required if FEATURE_KAFKA_ENABLED is 'true'").required().string()
			: '',
		clientId: env('KAFKA_CLIENT_ID').string('indexer'),
		namespace: env('KAFKA_NAMESPACE').string('indexer'),
		consumers: {
			song: songConsumer,
		},
		producers: {
			indexing: { topic: env('KAFKA_INDEXING_TOPIC') },
		},
	},
	repositories,
	server: {
		appName: env('APP_NAME').string('Indexer'),
		port: env('SERVER_PORT').number(3344),
	},
	song: {
		useLegacy: featureSongLegacy,
		pageSize: env('SONG_PAGE_SIZE').number(50),
	},
} as const;

export const getRepo = (code: string): Result<Repository> => {
	const repo = config.repositories.find((repo) => repo.code === code);
	return repo ? success(repo) : failure(`No repository configured with code ${code}`);
};

export default config;
