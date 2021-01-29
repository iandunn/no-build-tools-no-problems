/*
 * these are things that Core could provide to plugins
 */

/**
 * WordPress dependencies
 */
const { createElement } = window.wp.element;

window.wp = window.wp || {};


/**
 * External dependencies
 */
import htm from 'https://unpkg.com/htm?module'
// this would eventually be wp-includes/js/dist/htm.js or whatever. using unpkg.com in this context so don't have to add complexity of `npm install` step
// snowpack.dev could be used to import "bare module specifiers" like `import htm from 'htm'`

// Large projects wouldn't want to use this in production, but small/medium could just fine.
window.wp.html = htm.bind( createElement );
