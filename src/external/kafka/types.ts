export type KafkaConsumerConfiguration = {
	topic: string;
	group: string;
	dlq: boolean;

	partitionsConsumedConcurrently?: number;
	heartbeatInterval?: number;
	sessionTimeout?: number;
	rebalanceTimeout?: number;
};

export type KafkaTopicConfiguration = {
	topic: string;
	partitions: number;
};

export type KafkaProducerConfiguration = {
	topic: string;
};
