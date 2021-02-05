const postcssNested = require('postcss-nested');
const postcssPresetEnv = require( 'postcss-preset-env' );

module.exports = {
	plugins: [
		postcssNested(),
		postcssPresetEnv(), // this might have to go last
			// todo don't run during `watch` task b/c it'll strip out `debugger`, etc
			// or is it something else stripping those out?
	],
};
