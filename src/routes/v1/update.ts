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
import updateRepository from '../../processes/updateRepository';

import Logger from '../../logger';
import { authorizeWrite } from '../../middleware/authMiddleware';
import { isArray } from 'lodash';
import { parseQueryArray } from '../../utils/routeUtils';
const logger = Logger('Router', 'Update');

/**
 * @openapi
 * tags:
 *   - name: Update
 *     description: Fetch latest data and update indices to match
 */
const router = Router();

/**
 * Fetch all data from a repository, updating any entities with changes and indexing those updates.
 *
 * Async Process:
 * This request will begin a long running process that will complete asynchronously. The response will
 * only indicate that the work has begun.
 *
 * @openapi
 * /v1/update/repository/{code}:
 *   post:
 *     tags:
 *       - Update
 *     name: Update Repository
 *     description: Fetch all data from a repository, updating any entities with changes and indexing those updates.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: code
 *         in: path
 *         description: Repository code
 *         required: true
 *         schema:
 *           type: string
 *       - name: study
 *         in: query
 *         description: Study shortNames to include in update, all others will be filtered out. Leave empty to update all studies.
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *     responses:
 *       200:
 *         description: The process was initiated.
 *       400:
 *         description: Unknown repository code.
 *       401:
 *         description: Unauthorized. Authorization information is missing or invalid.
 *       403:
 *         description: Forbidden. Provided Authorization token is valid but has insufficient permissions to make this request.
 */
router.post('/repository/:code', authorizeWrite, (req, res) => {
	// Validate that we know the repo form the code, otherwise send error
	const { code } = req.params;
	const query = req.query;

	const studiesParam = parseQueryArray(query['study']);
	const studies = studiesParam.success ? studiesParam.data : undefined;
	if (!studiesParam.success) {
		logger.debug('study param value was not provided or could not be parsed', query['study'], studiesParam.message);
	}

	logger.debug('Received request to update indexes from repository', code);

	const repo = config.repositories.find((repo) => repo.code === code);
	if (repo === undefined) {
		logger.debug('Repository code not found', code, { options: config.repositories.map((repo) => repo.code) });
		res.status(400).json({ success: false, error: 'InvalidArgument', message: `Repository code '${code}' unknown.` });
		return;
	}

	// Initiate async process
	updateRepository(repo, { studies });

	// Send Response
	res.json({ success: true, message: `Starting update for repository: ${repo.name}` });
});

export default router;
