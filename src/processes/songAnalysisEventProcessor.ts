import { SongAnalysisMessage } from '../external/kafka/messages/SongAnalysisMessage';

/**
 * Process a notification from Song for an Analysis update
 * 1. Create or update stored entities for:
 * 	a. Analysis
 * 	b. All files in Analysis
 * 	c. Donor
 * 2. If any entities are created, add the relevant relationships to the DB
 * 3. If any VCF files are new, schedule a task to fetch and process variants from the file
 * 4. Schedule indexing task
 * @param message
 */
const songAnalysisEventProcessor = async (message: SongAnalysisMessage): Promise<void> => {
	const { analysis } = message;

	// analysis/file/donor entity updates

	// while updating files:
	//   1. Check if new file is VCF
	//   2. Fetch VCF File
	//   3. Parse VCF into variants
	//   4. Index Variants
};
export default songAnalysisEventProcessor;
