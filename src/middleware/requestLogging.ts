import morgan, { StreamOptions } from 'morgan';
import config from '../config';
import type { Logger } from '../logger';

export default function (logger: Logger) {
	// direct morgan http logs to the provided logger
	const stream: StreamOptions = {
		// Use the http severity
		write: (message) => logger.info(message),
	};

	// conditions for morgan to skip http request log
	const skip = (): boolean => {
		return config.env.isTest;
	};

	const logFormat = ':method :url :status :res[content-length] - :response-time ms';
	return morgan(logFormat, { stream, skip });
}
