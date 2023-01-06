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
