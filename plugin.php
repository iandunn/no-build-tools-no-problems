<?php

/*
 * Plugin Name: No Build Tools, No Problems
 * Description: Experiment building a WordPress-centric React app without any build tools.
 */

namespace NoBuildToolsNoProblems;
use function NoBuildToolsNoProblems\Core\preload_modules;

// This is the stuff the Core could potentially provide to plugins.
require __DIR__ . '/includes/core.php';
// Below this is stuff the plugin would need to do itself.


add_action( 'admin_menu', function() {
	add_menu_page(
		'No Build Tools, No Problems',
		'No Build Tools, No Problems',
		'read',
		'no-build-tools-no-problems',
		__NAMESPACE__ . '\Core\__return_placeholder_div'
	);
} );

// could maybe go in core.php?
function get_serve_folder() {
	// Cache the result so we don't have to hit the filesystem every time this is called.
	static $folder;

	if ( ! $folder ) {
		// cache the result as a static var or something so this can
		$folder = file_exists( __DIR__ . '/build/index.js' ) ? 'build' : 'source';
	}

	return $folder;
}

add_action( 'admin_enqueue_scripts', function() {
	$folder       = get_serve_folder();
	$dependencies = array( 'wp-element', 'wp-components' );

	if ( 'source' === $folder ) {
		$dependencies[] = 'nbtnp-core';
	}

	wp_enqueue_script(
		'no-build-tools-no-problems',
		plugins_url( "$folder/index.js", __FILE__ ),
		$dependencies,
		filemtime( __DIR__ . "/$folder/index.js" )
	);

	wp_enqueue_style(
		'no-build-tools-no-problems',
		plugins_url( 'source/app.css', __FILE__ ),
		array( 'wp-components' ),
		filemtime( __DIR__ . '/source/app.css' )
	);
} );

add_action( 'admin_head', function() {
	preload_modules( __DIR__ . '/'. get_serve_folder() );
} );
