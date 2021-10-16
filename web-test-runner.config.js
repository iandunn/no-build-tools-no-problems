process.env.NODE_ENV = 'test';

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
module.exports = {
	//port: 8082,
		// wtf this isn't working, circle back later

	plugins: [
		// Options: https://www.snowpack.dev/reference/configuration#testoptions
		require( '@snowpack/web-test-runner-plugin' )(

			// testOptions.files so don't have to specify in package.json?
				// or specify that directly via wtr options?
		)
	],
};
