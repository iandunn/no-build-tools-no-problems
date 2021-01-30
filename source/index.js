/**
 * WordPress dependencies
 */
const { render, createElement } = window.wp.element;

/**
 * Internal dependencies
 */
import { MainView } from './components/main.js';

/**
 * Initialize the app.
 */
function init() {
	const container = document.getElementById( 'toplevel_page_no-build-tools-no-problems-container' );

	const props = {};

	if ( container ) {
		render(
			createElement( MainView, props ),
			container
		);

		container.classList = []; // Remove .loading-content
	}
}

// now that this is defer'd, it's not guaranteed that it'll core.js will finish loading first?
// will probably break if it doesn't
//
// this is slow in ff w/ dev tools open
// fast when it's closed though. fast in chrome, but at least partially because of `modulepreload`
// any way to make it faster in ff?
init();
