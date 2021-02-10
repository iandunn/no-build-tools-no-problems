<?php

/*
 * Plugin Name: No Build Tools, No Problems
 * Description: Experiment building a WordPress-centric React app without any build tools.
 */

namespace No_Build_Tools_No_Problems;
use function No_Build_Tools_No_Problems\Core\{ __return_loading_container, preload_modules };

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
		__NAMESPACE__ . '\render_shell'
	);
} );

// render the basic markup and styles that don't need to be in react
// this gives the user _something_ while they wait for the rest to download/render
// even if it's just a header, it makes it _feel_ like the content is faster
// having something visual at the top anchors it too, so the whole page doesn't "jump" as everything is loaded all at once
//
// better name? not truly an app shell in the PWA sense
function render_shell() {
	?>
		<div class="wrap">
			<h1>No Build Tools, No Problems</h1>

			<?php if ( 'source' === get_serve_folder() ) : ?>

				<p>
					Currently serving files from <code>source/</code>, for the easiest developer experience.
				</p>

				<p>
					You can also <code>npm run build</code> to build optimized files for production, but it's not required.
				</p>

			<?php else : ?>

				<p>
					Currently serving files from <code>build/</code>, for optimal performance, older browser support, and developer experience enhancements.
				</p>

				<p>
					It's only necessary to test these before you deploy to production, or tag a release.

					Run <code>rm -rf build/</code> to switch back to using <code>source/</code> files.
				</p>

			<?php endif; ?>

			<?php __return_loading_container( 'nbtnp-cards-container' ); ?>
		</div>
	<?php
}


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
	$dependencies = array( 'nbtnp-core', 'wp-element', 'wp-components', 'wp-api-fetch' );
	// need to add wp-polyfill as a dependency? maybe for api-fetch & other stuff
		// it's added automatically?

	if ( 'source' === $folder ) {
		// Don't need HTM in production, because Babel transpiles it away.
		$dependencies[] = 'htm';
	}

	// this should only be needed when 'source' === $folder, because the build files target ES5, so they can't use modules
	// that's not working yet, though. see https://github.com/iandunn/no-build-tools-no-problems/issues/8
	$dependencies[] =  'es-module-shims';

	wp_enqueue_script(
		'no-build-tools-no-problems',
		plugins_url( "$folder/index.js", __FILE__ ),
		$dependencies,
		filemtime( __DIR__ . "/$folder/index.js" ),

		// footer is still necessary with `defer` because the dependencies don't have `defer`, and `wp-components` is massive.
		// maybe not even worth using `defer` b/c of that?
		true
	);
	wp_script_add_data( 'no-build-tools-no-problems', 'defer', true );

	// production files are transpiled to ES5, so can't use type=module
	// not working yet, see above
	//if ( 'source' === $folder ) {
		wp_script_add_data( 'no-build-tools-no-problems', 'type', 'module-shim' ); // convert to 'module' when no longer need shim
	//}

	wp_enqueue_style(
		'no-build-tools-no-problems',
		plugins_url( "$folder/global.css", __FILE__ ),
		array( 'wp-components' ),
		filemtime( __DIR__ . '/source/global.css' )
	);
	// add `defer` attr to ^ ? will this cause FOUC? maybe shouldn't b/c it's "critical" content? is it though?
		// once create global file, maybe leave that as blocking, but defer the others? they'll be implicitly defer'd if use @import in css (no?) or <link> in js (yes?)
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
add_action( 'admin_print_scripts-toplevel_page_no-build-tools-no-problems', function() {
	$hmr_folder = '/build/vendor/';

	if ( ! file_exists( __DIR__ . $hmr_folder . '/hmr-client.js' ) ) {
		// return early if not running watch task, how to detect?
		// presence of hmr-client in vendor folder? no b/c bundle task doesn't delete it
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
