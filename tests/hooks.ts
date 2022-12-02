import * as dotenv from 'dotenv';

// Ensure we use consistent environment variables for testing
dotenv.config({
	path: 'tests/setup/.env.test',
});

// export const mochaHooks = () => ({
// 	before: () => {
// 	},
// });
