/**
 * WordPress dependencies
 */
const { render, createElement } = window.wp.element;
	// is it ok to do this, or should they be `import`s at start of file?
	// is that possible without a build tool?

/**
 * Internal dependencies
 */
import { LatestPostsCard } from './components/latest-posts-card.js';

( function() {
	/**
	 * Initialize the app.
	 */
	function init() {
		const container = document.getElementById( 'toplevel_page_no-build-tools-no-problems-container' );

		const props = {};

		if ( container ) {
			render(
				createElement( LatestPostsCard, props ),
				container
			);
		}
	}

	document.addEventListener( 'DOMContentLoaded', init );
		// this is slow, can we just wait until #wpbody-content is loaded?
		// only slow b/c dev console open and caching disabled?
}() );
