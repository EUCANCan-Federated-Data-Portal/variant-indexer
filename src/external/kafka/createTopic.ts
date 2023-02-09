/*
 * Copyright (c) 2020 The Ontario Institute for Cancer Research. All rights reserved
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

import { Kafka } from 'kafkajs';
import Logger from '../../logger';
import { KafkaTopicConfiguration } from './types.js';
const logger = Logger('Kafka', 'CreateTopic');

/**
 * Connect to Kafka admin and create the topic with the provided configuration
 * If the topic already exists
 */
const createTopic = async (kafka: Kafka, config: KafkaTopicConfiguration) => {
	const topic = config.topic;
	const numPartitions = config.partitions;

	logger.info(topic, 'Attempting to create topic', config);
	const kafkaAdmin = kafka.admin();
	try {
		await kafkaAdmin.connect();
		logger.debug('Connected Kafka admin');
		const isTopicCreated = await kafkaAdmin.createTopics({
			topics: [
				{
					topic,
					numPartitions,
				},
			],
		});
		await kafkaAdmin.disconnect();
		if (isTopicCreated) {
			logger.info(topic, 'Successfully created topic');
		}
	} catch (error) {
		logger.error(topic, 'Error while creating topic', error);
		throw error;
	}
};

export default createTopic;
