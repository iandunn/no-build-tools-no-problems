<?php

/*
 * Plugin Name: No Build Tools, No Problems
 * Description: Experiment building a WordPress-centric React app without any build tools.
 */

namespace NoBuildToolsNoProblems;

// This is the stuff the Core could potentially provide to plugins.
require __DIR__ . '/includes/core.php';
// Below this is stuff the plugin would need to do itself.

const USE_BUILD_STEP = false;

add_action( 'admin_menu', function() {
	add_menu_page(
		'No Build Tools, No Problems',
		'No Build Tools, No Problems',
		'read',
		'no-build-tools-no-problems',
		__NAMESPACE__ . '\Core\__return_placeholder_div'
	);
} );

add_action( 'admin_enqueue_scripts', function() {
	$folder                    = 'source';
	$is_production_environment = in_array( wp_get_environment_type(), array( 'production', 'staging' ) );
	$dependencies              = array( 'wp-element', 'wp-components' );

	if ( USE_BUILD_STEP && $is_production_environment ) {
		$folder = 'build';
	} else {
		$dependencies[] = 'nbtnp-core';
	}

	wp_enqueue_script(
		'no-build-tools-no-problems',
		plugins_url( "$folder/app.js", __FILE__ ),
		$dependencies,
		filemtime( __DIR__ . "/$folder/app.js" )
	);

	wp_enqueue_style(
		'no-build-tools-no-problems',
		plugins_url( 'source/app.css', __FILE__ ),
		array( 'wp-components' ),
		filemtime( __DIR__ . '/source/app.css' )
	);
} );
