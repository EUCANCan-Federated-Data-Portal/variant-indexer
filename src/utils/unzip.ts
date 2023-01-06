import { arrayBuffer } from 'stream/consumers';
import zlib from 'zlib';

export async function unzipStream(stream: NodeJS.ReadableStream): Promise<string> {
	const buffer = await arrayBuffer(stream);
	const unzipped = zlib.unzipSync(buffer);
	return unzipped.toString('utf8');
}
