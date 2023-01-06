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

import { z as zod } from 'zod';
import { Analysis } from './dataTypes';

/* ===== Common Response Structures ===== */
export const PagedResponse = zod.object({
	totalAnalyses: zod.number(),
	currentTotalAnalyses: zod.number(),
});
export type PagedResponse = zod.infer<typeof PagedResponse>;

export const SongResponseError = zod.object({
	errorId: zod.string(),
	httpStatusCode: zod.number(),
	message: zod.string(),
});
export type SongResponseError = zod.infer<typeof SongResponseError>;

/* ===== Study Response Types ===== */
export const SongResponsesGetAllStudies = zod.array(zod.string());
export type SongResponsesGetAllStudies = zod.infer<typeof SongResponsesGetAllStudies>;

/* ===== Analysis Response Types ===== */
export const SongResponseGetAnalysis = Analysis;
export type SongResponseGetAnalysis = zod.infer<typeof SongResponseGetAnalysis>;

export const SongResponseGetPagedAnalyses = zod
	.object({
		analyses: zod.array(Analysis),
	})
	.merge(PagedResponse);
export type PagedAnalysisResponse = zod.infer<typeof SongResponseGetPagedAnalyses>;
