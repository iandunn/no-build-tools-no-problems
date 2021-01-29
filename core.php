<?php

namespace NoBuildToolsNoProblems\Core;

/*
 * These are things that Core could provide to plugins
 */

add_action( 'admin_enqueue_scripts', function() {
	return; // have to `import` in order to access `htm` variable? should be a way to do expose that globally while enqueuing. look at the different files in node_modules

	wp_register_script(
		'htm',
		'https://unpkg.com/htm@3.0.4/dist/htm.module.js?module', // would bundle locally for actual core usage
		array(),
		null // unpkg.com will 302 redirect if there's a `ver` param
	);
}, 9 );

/**
 * add type=module to script tag
 *
 * this is necessary for app.js to be able to `import` other files in the plugin
 *
 * workaround until https://core.trac.wordpress.org/ticket/12009 or https://core.trac.wordpress.org/ticket/22249 are fixed
 *
 * @param string $tag    The <script> tag for the enqueued script.
 * @param string $handle The script's registered handle.
 * @param string $src    The script's source URL.
 */
add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
	if ( ! SCRIPT_DEBUG ) {
		// this and other instances need to check if it's defined too, can't assume it's defined as false instead of just not defined at all
		return $tag;
	}

	$modules = array( 'htm', 'no-build-tools-no-problems' );

	if ( ! in_array( $handle, $modules, true ) ) {
		return $tag;
	}

	return str_replace( "' id=", "' type='module' id=", $tag );
}, 10, 3 );

// rename to "element" to be generic?
function __return_container_div( $id = '' ) {
	if ( ! $id ) {
		// this works, but it'd be nice to be able to pass in an arbitrary id from things like add_menu_page()
		$id = current_filter() . '-container';
	}

	// would be nice to show a spinner here

	echo "<div id='$id'>loading...</div>";
}
