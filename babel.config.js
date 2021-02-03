'use strict';

module.exports = function ( api ) {
	api.cache( true );

	const presets = [
		["@babel/preset-react"], // Transpile React code down to native JavaScript.
		["@babel/preset-env"],   // Transpile down to the browsers defined in `package.json:browserslist`.
	];

	const plugins = [
		[ 'htm', { 'pragma': 'window.wp.element.createElement' } ],
		"@babel/plugin-proposal-class-properties"
	];

	return {
		presets,
		plugins
	};
};
