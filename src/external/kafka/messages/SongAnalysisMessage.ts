import { z as zod } from 'zod';

export const SongEventAction = zod.enum(['CREATED', 'PUBLISHED', 'SUPPRESSED', 'UNPUBLISHED']);
export type SongEventAction = zod.infer<typeof SongEventAction>;
export const SongState = zod.enum(['PUBLISHED', 'SUPPRESSED', 'UNPUBLISHED']);
export type SongState = zod.infer<typeof SongState>;
export const SongFileAccess = zod.enum(['controlled', 'open']);
export type SongFileAccess = zod.infer<typeof SongFileAccess>;

const SongFile = zod.object({
	info: zod.object({}).passthrough(),
	objectId: zod.string(),
	studyId: zod.string(),
	analysisId: zod.string(),
	fileName: zod.string(),
	fileSize: zod.number(),
	fileType: zod.string(),
	fileMd5sum: zod.string(),
	fileAccess: SongFileAccess,
	dataType: zod.string(),
});
export type SongFile = zod.infer<typeof SongFile>;

const SongAnalysisMessage = zod.object({
	analysisId: zod.string(),
	studyId: zod.string(),
	state: SongState,
	action: SongEventAction,
	songServerId: zod.string(),
	analysis: zod
		.object({
			files: zod.array(SongFile),
		})
		.passthrough(),
});
export type SongAnalysisMessage = zod.infer<typeof SongAnalysisMessage>;
export default SongAnalysisMessage;
