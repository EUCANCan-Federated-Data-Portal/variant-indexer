import { Kafka } from 'kafkajs';

import consumers from './consumers';
import config from '../../config';
import Logger from '../../logger';
import producers from './producers';
// import createTopic from './createTopic';

const logger = Logger('Kafka');

export const setup = async () => {
	const kafka = new Kafka({
		clientId: config.kafka.clientId,
		brokers: config.kafka.brokers,
	});

	logger.info('Initializing Kafka...');

	/* TOPICS */
	// await createTopic(kafka, kafkaConfig.topics.programQueue)

	/* CONSUMERS */
	await Promise.all(consumers.map((consumer) => consumer.init(kafka)));

	/* PRODUCERS */
	await Promise.all(producers.map((producer) => producer.init(kafka)));

	logger.info('All connections initialized!');
};

export const disconnect = async () => {
	logger.warn('Disconnecting all from Kafka...');
	await Promise.all(consumers.map((consumer) => consumer.disconnect()));
	logger.warn('Disconnected!');
};
