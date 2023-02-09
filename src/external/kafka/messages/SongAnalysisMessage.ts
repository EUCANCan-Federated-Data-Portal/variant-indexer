/*
 * Copyright (c) 2020 The Ontario Institute for Cancer Research. All rights reserved
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

export const SongEventAction = zod.enum(['CREATED', 'PUBLISHED', 'SUPPRESSED', 'UNPUBLISHED']);
export type SongEventAction = zod.infer<typeof SongEventAction>;
export const SongState = zod.enum(['PUBLISHED', 'SUPPRESSED', 'UNPUBLISHED']);
export type SongState = zod.infer<typeof SongState>;
export const SongFileAccess = zod.enum(['controlled', 'open']);
export type SongFileAccess = zod.infer<typeof SongFileAccess>;

const SongFile = zod.object({
	info: zod.object({}).passthrough(),
	objectId: zod.string(),
	studyId: zod.string(),
	analysisId: zod.string(),
	fileName: zod.string(),
	fileSize: zod.number(),
	fileType: zod.string(),
	fileMd5sum: zod.string(),
	fileAccess: SongFileAccess,
	dataType: zod.string(),
});
export type SongFile = zod.infer<typeof SongFile>;

const SongAnalysisMessage = zod.object({
	analysisId: zod.string(),
	studyId: zod.string(),
	state: SongState,
	action: SongEventAction,
	songServerId: zod.string(),
	analysis: zod
		.object({
			files: zod.array(SongFile),
		})
		.passthrough(),
});
export type SongAnalysisMessage = zod.infer<typeof SongAnalysisMessage>;
export default SongAnalysisMessage;
