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

import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';
import { KafkaConsumerConfiguration } from '../types';
import globalConfig from '../../../config';
import Logger from '../../../logger';

export type KafkaConsumer = {
	init: (kafka: Kafka) => Promise<void>;
	disconnect: () => Promise<void>;
	sendDlqMessage: (messageJSON: string) => Promise<void>;
	config: KafkaConsumerConfiguration;
	consumer?: Consumer;
	dlqProducer?: Producer;
};

/**
 * Initialize a Kafka Consumer from config. Handles
 * @param config
 * @param messageHandler
 * @returns
 */
function createConsumer<T>(
	config: KafkaConsumerConfiguration,
	parser: (message: KafkaMessage) => T,
	messageHandler: (message: T) => Promise<void>,
): KafkaConsumer {
	const logger = Logger('KafkaConsumer', config.group, config.topic);

	let consumer: Consumer | undefined;
	let dlqProducer: Producer | undefined;

	/**
	 * Call on startup to create the consumer
	 *  */
	const init = async (kafka: Kafka) => {
		consumer = kafka.consumer({
			groupId: `${globalConfig.kafka.namespace}.${config.group}`,
			heartbeatInterval: config.heartbeatInterval,
			sessionTimeout: config.sessionTimeout,
			rebalanceTimeout: config.rebalanceTimeout,
		});
		consumer.subscribe({
			topic: config.topic,
		});
		await consumer.connect();

		const dlqTopic = config.dlq;
		if (dlqTopic) {
			dlqProducer = kafka.producer({
				allowAutoTopicCreation: true,
			});
			await dlqProducer.connect();
		}

		await consumer
			.run({
				partitionsConsumedConcurrently: config.partitionsConsumedConcurrently,
				eachMessage: async ({ message }) => {
					logger.info(`New message received offset : ${message.offset}`);
					await handleMessage(message);
					logger.debug(`Message handled ok`);
				},
			})
			.catch((e) => {
				logger.error('Failed to run consumer ' + e.message, e);
				throw e;
			});
	};

	/**
	 * Call on program terminate to disconnect
	 *  */
	const disconnect = async () => {
		await consumer?.disconnect();
		await dlqProducer?.disconnect();
	};

	const sendDlqMessage = async (messageJSON: string) => {
		if (config.dlq && dlqProducer) {
			const result = await dlqProducer?.send({
				topic: `${globalConfig.kafka.namespace}.dlq.${config.group}.${config.topic}`,
				messages: [
					{
						value: JSON.stringify(messageJSON),
					},
				],
			});
			logger.debug(`DLQ message sent to ${config.dlq}. Response: ${JSON.stringify(result)}`);
		} else {
			logger.debug(`No DLQ configured for ${config.topic} consumer. Not sending message to a DLQ.`);
		}
	};

	/**
	 * Wrapper for the provided messageHandler, will catch all errors and send DLQ message if a DLQ topic is provided in the config
	 * @param message
	 */
	async function handleMessage(message: KafkaMessage) {
		try {
			await messageHandler(parser(message));
		} catch (error) {
			logger.error(`Error processing offset: ${message.offset}`, error);

			const msg = message.value
				? JSON.parse(message.value.toString())
				: { message: `invalid body, original offset: ${message.offset}` };
			await sendDlqMessage(msg);
		}
	}

	return { init, disconnect, sendDlqMessage, config, consumer, dlqProducer };
}

export default createConsumer;
