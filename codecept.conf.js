require('ts-node/register');
process.env.TOKEN = process.env.TOKEN || (() => {throw Error(`Token is missing`)})();

exports.config = {
	tests: './**/*_test.ts',
	output: './output',
	helpers: {
		REST: {
			endpoint: 'https://api.twitter.com/2',
		},
		JSONResponse: {}
	},
	include: {
		I: './steps_file.ts'
	},
	bootstrap: null,
	mocha: {},
	name: 'codeceptjs-twitter-api-tests',
	plugins: {
		allure: {
			outputDir: 'report',
			enabled: true
		}
	}
};
