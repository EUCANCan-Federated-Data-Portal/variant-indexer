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

import { Kafka, Producer } from 'kafkajs';
import { KafkaProducerConfiguration } from '../types';
import globalConfig from '../../../config';
import Logger from '../../../logger';

export type KafkaProducer<T> = {
	disconnect: () => Promise<void>;
	init: (kafka: Kafka) => Promise<void>;
	sendMessage: (message: T) => Promise<void>;
};

const createProducer = <T>(config: KafkaProducerConfiguration): KafkaProducer<T> => {
	let producer: Producer;

	const logger = Logger('KafkaProducer', config.topic);

	const disconnect = async (): Promise<void> => {
		producer?.disconnect();
	};
	const init = async (kafka: Kafka): Promise<void> => {
		producer = kafka.producer();
		await producer.connect();
	};
	const sendMessage = async (message: T): Promise<void> => {
		if (producer) {
			const result = await producer.send({
				topic: `${globalConfig.kafka.namespace}.${config.topic}`,
				messages: [
					{
						value: JSON.stringify(message),
					},
				],
			});
			logger.debug(`Message sent. Response: ${JSON.stringify(result)}`);
		}
	};

	return { init, disconnect, sendMessage };
};

export default createProducer;
