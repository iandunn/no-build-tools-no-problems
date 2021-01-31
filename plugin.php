<?php

/*
 * Plugin Name: No Build Tools, No Problems
 * Description: Experiment building a WordPress-centric React app without any build tools.
 */

namespace NoBuildToolsNoProblems;
use function NoBuildToolsNoProblems\Core\preload_modules;

// This is the stuff the Core could potentially provide to plugins.
require __DIR__ . '/core/core.php';
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

add_action( 'admin_enqueue_scripts', function() {
	preload_modules( __DIR__ . '/'. get_serve_folder() );
}, 1 ); // As early as possible inside <head>

// this could maybe go in core.php?
function get_serve_folder() {
	// Cache the result so we don't have to hit the filesystem every time this is called.
	static $folder;

	if ( ! $folder ) {
		// cache the result as a static var or something so this can
		$folder = file_exists( __DIR__ . '/build/index.js' ) ? 'build' : 'source';
	}

	return $folder;
}

// enqueue 3rd-party dependencies temporarily until they can be imported
add_action( 'admin_enqueue_scripts', function( $hook_suffix ) {
	wp_enqueue_script(
		'chart.js',
		plugins_url( "node_modules/chart.js/dist/Chart.js", __FILE__ ),
		array(),
		filemtime( __DIR__ . "/node_modules/chart.js/dist/Chart.js" )
	);
}, 9 );

add_action( 'admin_enqueue_scripts', function( $hook_suffix ) {
	if ( 'toplevel_page_no-build-tools-no-problems' !== $hook_suffix ) {
		return;
	}

	$folder       = get_serve_folder();
	$dependencies = array( 'wp-element', 'wp-components', 'wp-api-fetch' );

	if ( 'source' === $folder ) {
		$dependencies[] = 'nbtnp-core';
	}

	wp_enqueue_script(
		'no-build-tools-no-problems',
		plugins_url( "$folder/index.js", __FILE__ ),
		$dependencies,
		filemtime( __DIR__ . "/$folder/index.js" )
	);
	wp_script_add_data( 'no-build-tools-no-problems', 'defer', true );
	wp_script_add_data( 'no-build-tools-no-problems', 'type', 'module' );

	wp_enqueue_style(
		'no-build-tools-no-problems',
		plugins_url( 'source/app.css', __FILE__ ),
		array( 'wp-components' ),
		filemtime( __DIR__ . '/source/app.css' )
	);
} );
