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
