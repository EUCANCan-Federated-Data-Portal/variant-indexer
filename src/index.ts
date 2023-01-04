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

import Logger from './logger';
import config from './config';
import getServer from './server';
import * as kafka from './external/kafka';
import * as ego from './external/ego';

const logger = Logger('Main');

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

(async () => {
	/*
		INITIALIZE EXTERNAL DEPENDENCIES
		- kafka
		- ego
	 */

	// Not waiting for kafka, it is slow to start. It will throw errors if connections fail.
	kafka.setup();

	await ego.getEgoToken();

	/*
		START EXPRESS WEB SERVER
	 */
	const server = await getServer();
	server.listen(config.server.port, () => {
		logger.info(`Web server started, listening on`, config.server.port);
		if (config.env.isDev) {
			logger.info(`Swagger is available at http://localhost:${config.server.port}/v1/api-docs`);
		}
	});
})();

errorTypes.map((type) => {
	process.on(type as any, async (e: Error) => {
		try {
			// serverLog.info(`process.on ${type}`);
			// serverLog.error(e.message);
			console.log(e);

			// Terminate any connections, as required
			await kafka.disconnect();

			process.exit(0);
		} catch (_) {
			process.exit(1);
		}
	});
});

signalTraps.map((type) => {
	process.once(type as any, async () => {
		try {
			// Terminate any connections, as required
			await kafka.disconnect();
		} finally {
			process.kill(process.pid, type);
		}
	});
});
