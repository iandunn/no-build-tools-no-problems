<?php

/*
 * Plugin Name: No Build Tools, No Problems
 * Description: Experiment building a WordPress-centric React app without any build tools.
 */

namespace NoBuildToolsNoProblems;
use function NoBuildToolsNoProblems\Core\{ __return_placeholder_div, preload_modules };

// This is the stuff the Core could potentially provide to plugins.
require __DIR__ . '/core/core.php';
// Below this is stuff the plugin would need to do itself.


// create admin page
add_action( 'admin_menu', function() {
	add_menu_page(
		'No Build Tools, No Problems',
		'No Build Tools, No Problems',
		'read',
		'no-build-tools-no-problems',
		function() {
			// this works, but it'd be nice to be able to pass in an arbitrary id from things like add_menu_page()
			// `wp_add_dashboard_widget()` provides a `$callback_args` param, which gets passed to the callback.
			// could add something like that to all Core functions that ask for a callback
			__return_placeholder_div( 'nbtnp-container' );
		}
	);
} );

// add preloadmodule links
add_action( 'admin_enqueue_scripts', function() {
	preload_modules( __DIR__ . '/' . get_serve_folder() );
}, 1 ); // As early as possible inside <head>

// determine to serve from source/ or build/
function get_serve_folder() {
	// Cache the result so we don't have to hit the filesystem every time this is called.
	static $folder;

	if ( ! $folder ) {
		// cache the result as a static var or something so this can
		$folder = file_exists( __DIR__ . '/build/index.js' ) ? 'build' : 'source';
	}

	return $folder;
}


// register/enqueue scripts & styles
add_action( 'admin_enqueue_scripts', function( $hook_suffix ) {
	if ( 'toplevel_page_no-build-tools-no-problems' !== $hook_suffix ) {
		return;
	}

	$folder       = get_serve_folder();
	$dependencies = array( 'wp-element', 'wp-components', 'wp-api-fetch', 'es-module-shims' );
	// need to add wp-polyfill as a dependency? maybe for api-fetch & other stuff

	//	if ( 'source' === $folder ) {
	$dependencies[] = 'nbtnp-core';
	// todo need for htm even in build, until we config snowpack to use babel to transpile htm to raw js

	// if that working, then maybe uninstal npm packages being used. can ditch npm alltogether?
	//	}

	wp_enqueue_script(
		'no-build-tools-no-problems',
		plugins_url( "$folder/index.js", __FILE__ ),
		$dependencies,
		filemtime( __DIR__ . "/$folder/index.js" )
	);
	wp_script_add_data( 'no-build-tools-no-problems', 'defer', true );
	wp_script_add_data( 'no-build-tools-no-problems', 'type', 'module-shim' ); // convert to 'module' when no longer need shim

	wp_enqueue_style(
		'no-build-tools-no-problems',
		plugins_url( 'source/app.css', __FILE__ ),
		array( 'wp-components' ),
		filemtime( __DIR__ . '/source/app.css' )
	);
} );

// generate import map
add_action( 'admin_print_scripts', function() {
	$package_folder = '/build/vendor/pkg/';

	if ( ! is_dir( __DIR__ . $package_folder ) ) {
		return;
	}

	// build this dynamically? from snowpack.deps.json?
		// or maybe from `build/vendor/pkg/import-map.json`, but the paths there are wrong, would need to convert to the URLs below
		// there's a plugin for that -- https://www.npmjs.com/package/snowpack-plugin-import-map
	// what about when there are shared things tree-shoken out of individual deps?
	// check when add more packages
	$dependencies = array(
		'imports' => array(
			"uuid"      => esc_url_raw( plugins_url( $package_folder . 'uuid.js', __FILE__ ) ),
			"hash-wasm" => esc_url_raw( plugins_url( $package_folder . 'hash-wasm.js', __FILE__ ) ),
		),
	);

	?>

	<script type="importmap-shim">
		<?php
			echo wp_json_encode( $dependencies );
			// any security considerations?
		?>
	</script>

	<?php
} );

// setup auto reloading
// actual hmr isn't working yet -- https://github.com/snowpackjs/snowpack/discussions/2565
// should be in core.php?
add_action( 'admin_print_scripts', function() {
	$hmr_folder = '/build/vendor/';

	if ( ! file_exists( __DIR__ . $hmr_folder . '/hmr-client.js' ) ) {
		// return early if not running watch task, how to detect?
		// presence of hmr-client in vendor folder
		return;
	}

	?>

	<script>
		// is it safe to hardcode that port? maybe set it in config file and pull from .env file?
		window.HMR_WEBSOCKET_URL = 'ws://localhost:12321';
	</script>

    <script type="module" src="<?php echo plugins_url( $hmr_folder . '/hmr-client.js', __FILE__ ); ?>"></script>
	<script type="module" src="<?php echo plugins_url( $hmr_folder . '/hmr-error-overlay.js', __FILE__ ); ?>"></script>

	<?php
} );
