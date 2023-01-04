import { Kafka, Producer } from 'kafkajs';
import { KafkaProducerConfiguration } from '../types';
import globalConfig from '../../../config';
import Logger from '../../../logger';

export type KafkaProducer<T> = {
	disconnect: () => Promise<void>;
	init: (kafka: Kafka) => Promise<void>;
	sendMessage: (message: T) => Promise<void>;
};

const createProducer = <T>(config: KafkaProducerConfiguration): KafkaProducer<T> => {
	let producer: Producer;

	const logger = Logger('KafkaProducer', config.topic);

	const disconnect = async (): Promise<void> => {
		producer?.disconnect();
	};
	const init = async (kafka: Kafka): Promise<void> => {
		producer = kafka.producer();
		await producer.connect();
	};
	const sendMessage = async (message: T): Promise<void> => {
		if (producer) {
			const result = await producer.send({
				topic: `${globalConfig.kafka.namespace}.${config.topic}`,
				messages: [
					{
						value: JSON.stringify(message),
					},
				],
			});
			logger.debug(`Message sent. Response: ${JSON.stringify(result)}`);
		}
	};

	return { init, disconnect, sendMessage };
};

export default createProducer;
