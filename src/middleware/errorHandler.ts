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

import { NextFunction, Request, Response } from 'express';
import { unknownToString } from '../utils/stringUtils';

/**
 * Map of response status to send for different caugh error types
 */
const STATUS_MAP: Record<string, number> = {
	// Ego Token Middleware thrown error names:
	Forbidden: 403,
	Unauthorized: 401,
};

/**
 * Set default response for unhandled errors to be json instead of html.
 * @param err
 * @param _req
 * @param res
 * @param next
 * @returns
 */
function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): any {
	if (res.headersSent) {
		return next(err);
	}

	const defaultName = 'ServerError';
	const error = err instanceof Error ? err.name || defaultName : defaultName;

	const status = STATUS_MAP[error] || 500; // status from map, otherwise default to 500 for server error

	const message = unknownToString(err);

	res.status(status).json({ error, message });

	// Pass the error to any other error handlers, including express default.
	next(err);
}

export default errorHandler;
