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
import npmPackage from '../package.json';
import env from './utils/envUtils';

const config = {
	env: {
		isProduction: env('NODE_ENV').matches('production'),
		isTest: env('NODE_ENV').matches('test'),
		version: env('BUILD_VERSION').string(npmPackage.version),
	},
	auth: {
		ego: {
			host: env('EGO_HOST', 'URL for Ego Auth API ex. http://ego.ui').required().string(),
			// credentials: {
			// 	id: env('EGO_CLIENT_ID').required().string(),
			// 	secret: env('EGO_CLIENT_SECRET').required().string(),
			// },
		},
	},
	// db: {
	// 	host: env('PG_HOST').required().string(),
	// 	port: env('PG_PORT').required().number(),
	// 	user: env('PG_USER').required().string(),
	// 	pass: env('PASS').required().string(),
	// 	db: env('PG_DB').required().string(),
	// },
	logs: {
		level: env('LOG_LEVEL').options(['debug', 'info', 'warning', 'error']).string('info'), // log level used in deployed app
	},
	server: {
		port: env('SERVER_PORT').number(3344),
	},
};
export default config;
