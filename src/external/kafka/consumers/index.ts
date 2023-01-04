import config from '../../../config';
import songAnalysisEventProcessor from '../../../processes/songAnalysisEventProcessor';
import createConsumer, { KafkaConsumer } from './createConsumer';
import SongAnalysisMessage from '../messages/SongAnalysisMessage';

const songAnalysisConsumer = createConsumer(
	config.kafka.consumers.song,
	SongAnalysisMessage.parse,
	songAnalysisEventProcessor,
);

const consumers: KafkaConsumer[] = [songAnalysisConsumer];
export default consumers;
