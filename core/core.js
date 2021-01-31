/*
 * these are things that Core could provide to plugins
 */

/**
 * WordPress dependencies
 */
const { createElement } = wp.element;

window.wp = window.wp || {};


/**
 * External dependencies
 */
import htm from 'https://unpkg.com/htm@3.0.4/dist/htm.module.js?module'
// this would eventually be wp-includes/js/dist/htm.js or whatever. using unpkg.com in this context so don't have to add complexity of `npm install` step
// snowpack.dev could be used to import "bare module specifiers" like `import htm from 'htm'`
// once #1 is solved, though, could maybe use that instead of importing via URL
	// no, because that'd require everyone to use a build step even in dev environs.
	// that should be a progressive enhance, never a requirement
	// could download this to `core/htm.js` though, and enqueue it as a dependency. treat it like a core file.
		// yeah, that's good. it'd be faster (at least in dev envs, plus no dns lookup), could use offline too.
	// but then how to `import` it? need to expose it via `wp.htm` or something.
	// just import from `./core/htm.js`, then wp.htm

// Large projects wouldn't want to use this in production, but small/medium could just fine.
wp.html = htm.bind( createElement );
