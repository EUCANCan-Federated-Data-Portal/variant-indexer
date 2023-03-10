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

import { Router } from 'express';
import config from '../../config';
import { authorizeRead } from '../../middleware/authMiddleware';

/**
 * @openapi
 * tags:
 *   - name: Status
 *     description: Server status and health check
 */
const router = Router();

const startTime = new Date();

/**
 * Respond with 200OK and some server status information.
 *
 * @openapi
 * /v1/status:
 *   get:
 *     tags:
 *       - Status
 *     name: Health Check
 *     description: Ping!
 *     responses:
 *       200:
 *         description: Respond 200 OK
 */
router.get('/', (_req, res) => {
	return res.json({
		status: {
			server: 'OK',
			db: 'N/A',
		},
		uptime: new Date().valueOf() - startTime.valueOf(),
		version: config.env.version,
	});
});

/**
 * Respond with 200OK and some server status information.
 *
 * @openapi
 * /v1/status/repos:
 *   get:
 *     tags:
 *       - Status
 *     name: Health Check
 *     description: Ping!
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JSON with list of repositories
 */
router.get('/repos', authorizeRead, (_req, res) => {
	return res.json({
		repos: config.repositories.map((repo) => ({ code: repo.code, name: repo.name })),
	});
});

export default router;
