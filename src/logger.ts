/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { createLogger, LoggerOptions, transports, format } from 'winston';
import config from './config';
import { unknownToString } from './utils/stringUtils';

const APP_NAME = config.server.appName;

const { combine, timestamp, colorize, printf } = format;

const { isProduction } = config.env;
const logLevel = config.logs.level;

/* ===== Transports ===== */
const consoleTransport = new transports.Console({
	level: isProduction ? logLevel : 'debug',
});
const debugFileTransport = new transports.File({ filename: 'debug.log', level: 'debug' });

/* ===== Config ===== */
const options: LoggerOptions = {
	silent: config.env.isTest,
	format: combine(
		colorize(),
		timestamp(),
		printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
	),
	transports: isProduction ? [consoleTransport] : [consoleTransport, debugFileTransport],
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== 'production') {
	logger.debug(`[${APP_NAME}.Logger] Logging initialized at debug level`);
}

const Logger = (...service: string[]) => {
	const buildServiceMessage = (...messages: any[]) => {
		const strings: string[] = messages.map(unknownToString);
		return `[${[APP_NAME, ...service].join('.')}] ${strings.join(' - ')}`;
	};
	return {
		debug: (...messages: any[]) => logger.debug(buildServiceMessage(...messages)),
		info: (...messages: any[]) => logger.info(buildServiceMessage(...messages)),
		warn: (...messages: any[]) => logger.warn(buildServiceMessage(...messages)),
		error: (...messages: any[]) => logger.error(buildServiceMessage(...messages)),
		log: (level: LogLevel, ...messages: any[]) => {
			const message = buildServiceMessage(...messages);
			switch (level) {
				case LogLevel.DEBUG:
					return logger.debug(message);
				case LogLevel.INFO:
					return logger.info(message);
				case LogLevel.WARN:
					return logger.warn(message);
				case LogLevel.ERROR:
					return logger.error(message);
			}
		},
	};
};
export default Logger;
export type Logger = ReturnType<typeof Logger>;
export enum LogLevel {
	DEBUG,
	INFO,
	WARN,
	ERROR,
}
