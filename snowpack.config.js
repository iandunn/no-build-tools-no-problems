// @see https://www.snowpack.dev/reference/configuration

module.exports = {
	mount: {
		source: '/', // Don't need `core/` since that'll theoretically be provided by Core.
	},

	plugins: [
		/*
		 todo
		 setup babel
		 also look at sass, maybe postcss - see #6

		those might be helpful
			build-script also helpful? run-script?
			react-refresh
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

		// minify files and other optimizations - plugins section?
	},
};
