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

import { Kafka } from 'kafkajs';

import consumers from './consumers';
import config from '../../config';
import Logger from '../../logger';
import producers from './producers';
// import createTopic from './createTopic';

const logger = Logger('Kafka');

export const setup = async () => {
	const kafka = new Kafka({
		clientId: config.kafka.clientId,
		brokers: [config.kafka.brokers],
	});

	logger.info('Initializing Kafka...');

	/* TOPICS */
	// await createTopic(kafka, kafkaConfig.topics.programQueue)

	/* CONSUMERS */
	await Promise.all(consumers.map((consumer) => consumer.init(kafka)));

	/* PRODUCERS */
	await Promise.all(producers.map((producer) => producer.init(kafka)));

	logger.info('All connections initialized!');
};

export const disconnect = async () => {
	logger.warn('Disconnecting all from Kafka...');
	await Promise.all(consumers.map((consumer) => consumer.disconnect()));
	logger.warn('Disconnected!');
};
