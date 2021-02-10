/*
 * these are things that Core could provide to plugins
 */

/**
 * WordPress dependencies
 */
const { render, createElement } = wp.element;

// can automatically wrap in fragments to avoid React unnecessarily complaining, or convert to short fragment?
// xref https://github.com/developit/htm/issues/175
if ( 'function' === typeof htm ) {
	wp.html = htm.bind( createElement );
	// todo doh, there already _is_ a wp.html, see js/shortcodes.js
	// so make this wp.html.htm, then change all html`` calls to htm`` + `const { htm } = wp.html`
}

/**
 * Render a module into a loading container.
 *
 * This works in conjunction with `__return_loading_container()` on the PHP side.
 */
wp.utils = wp.utils || {}; // is this gonna get overwritten if actually enqueue wp.utils? probably. should be workaround until this is theoretically added to core.
wp.utils.renderLoadingContainer = function( container_id, component, props ) {
	const container = document.getElementById( container_id );

	if ( container ) {
		render(
			createElement( component, props ),
			container
		);

		container.classList = []; // Remove .loading-content
	}
}
