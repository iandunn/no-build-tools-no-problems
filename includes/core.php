<?php

namespace NoBuildToolsNoProblems\Core;

/*
 * These are things that Core could provide to plugins
 */

add_action( 'admin_enqueue_scripts', function() {
	// This is always loaded from `source/`, because it's not needed when a build step is used.
	wp_register_script(
		'nbtnp-core',
		plugins_url( 'source/core.js', __DIR__ ),
		array(),
		filemtime( dirname( __DIR__ ) . '/source/core.js' )
	);
}, 9 );

/**
 * add type=module to script tag
 *
 * this is necessary for app.js to be able to `import` other files in the plugin
 *
 * workaround until https://core.trac.wordpress.org/ticket/12009 or https://core.trac.wordpress.org/ticket/22249 are fixed
 */
add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
	$modules = array( 'no-build-tools-no-problems', 'nbtnp-core' );

	if ( ! in_array( $handle, $modules, true ) ) {
		return $tag;
	}

	return str_replace( "' id=", "' type='module' id=", $tag );
}, 10, 3 );

// rename to "element" to be generic?
// maybe use "placeholder" or "shell". not an app shell in the PWA sense.
function __return_placeholder_div( $id = '' ) {
	if ( ! $id ) {
		// this works, but it'd be nice to be able to pass in an arbitrary id from things like add_menu_page()
		$id = current_filter() . '-container';
	}

	// would be nice to show a spinner here

	echo "<div id='$id'>loading...</div>";
}
