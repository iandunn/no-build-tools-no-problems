// @see https://www.snowpack.dev/reference/configuration

module.exports = {
	mount: {
		source: '/', // Don't need `core/` since that'll theoretically be provided by Core.
	},

	plugins: [
		"@snowpack/plugin-babel"

		/*
		 todo
		 also look at sass, maybe postcss - see #6

		basic hmr
		also react-refresh - don't just want hmr, want "fash refresh"

		those might be helpful
			build-script also helpful? run-script?

			webpack to do in prod - that could be an interesting way to intergrate w/ wp-scripts
			hmr-inject
			import-map
		*/
	],

	packageOptions: {
		// We're not using their localhost server to stream imports from their CDN, but we still want Snowpack to
		// manage production dependencies instead of npm, because it's a much better bundler than webpack.
		// npm will still manage `devDependencies`.
		source: 'remote',
	},

	// Not using their localhost server because need everything to run inside WordPress/PHP context.
	//devOptions: {},

	buildOptions: {
		metaUrlPath : 'vendor',

		// watch true ? need b/c not using their web server? maybe the _server_ is what does the `import from 'uuid' to import from 'skypack.dev` translation?
	},

	optimize: {
		// Add other files here for any modules that are imported dynamically, and for any files that are only
		// loaded on some screens. e.g., admin.js for wp-admin, and front-end.js for the front end.
		entrypoints: [ 'source/index.js' ],

		// HTTP2 is above 50% now, but it's still helpful to bundle JS modules, to prevent waterfall bottlenecks.
		// Once Safari & Firefox support `modulepreload`, this will no longer be necessary.
		bundle: true,

		treeshake: true,
		minify: true,
		target: 'es2015',
	},
};
