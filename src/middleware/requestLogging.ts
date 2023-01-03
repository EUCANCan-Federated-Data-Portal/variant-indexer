import { Request } from 'express';
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
	const skip = (req: Request): boolean => {
		// Filter out all requests for dependencies of the swagger docs
		const isSwaggerDependency = req.originalUrl.match(/api-docs\/.+/);

		// Filter out requests for favicon
		const isFavicon = req.originalUrl === '/favicon.ico';

		// if any of the checks are true, don't log:
		return [config.env.isTest, isSwaggerDependency, isFavicon].some((i) => i);
	};

	const logFormat = ':method :url :status :res[content-length] - :response-time ms';
	return morgan(logFormat, { stream, skip });
}
