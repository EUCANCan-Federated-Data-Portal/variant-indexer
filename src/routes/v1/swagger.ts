import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import config from '../../config';

const options = swaggerJsdoc({
	failOnErrors: true,
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'Indexing Service',
			version: config.env.version,
			description: '',
			license: {
				name: 'APGL',
				url: 'https://www.gnu.org/licenses/agpl-3.0.en.html',
			},
			servers: [
				{
					url: '/v1',
				},
			],
		},
	},
	apis: ['./src/routes/v1/status.ts'],
});

const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(options));

export default router;
