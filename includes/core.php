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
		// `wp_add_dashboard_widget()` provides a `$callback_args` param, which gets passed to the callback.
		// could add something like that to all Core functions that ask for a callback
		$id = current_filter() . '-container';
			// does this work in all contexts? it does for add_menu_page, but maybe won't elsewhere
	}

	?>

	<div id="<?php echo esc_attr( $id ); ?>" class="loading-content">
		<p class="spinner is-active">
			<span class="screen-reader-text">
				Loading...
			</span>
		</p>
	</div>

	<?php
}

// call during wp_head and/or admin_head
	// better action?
// ideally would just wp_enqueue_script and automatically have type="module" and corresponding <link rel="preload" ...>
function preload_modules( $plugin_folder ) {
	// the order is important here, start w/ deepest depeendencies?
		// need to make this DRY with core.js, but depends on how it'll eventually be used there
	printf( '<link rel="modulepreload" href="https://unpkg.com/htm?module" />' );

	$plugin_folder = untrailingslashit( $plugin_folder );
	$files         = glob( $plugin_folder . "/{,*/,*/*/,*/*/*/}*.js", GLOB_BRACE );

	foreach ( $files as $file ) {
		$url = plugins_url( basename( $file ), $file );

		// enqueued files need the &ver= param so they match the enqueued url, imports don't
		$enqueued = in_array( basename( $file ), array( 'core.js', 'app.js' ), true );

		if ( $enqueued ) {
			// ideally wp_enqueue_script would handle this, so that the value is DRY & not tightly coupled between here and plugin.php
			$url = add_query_arg( 'ver', rawurlencode( filemtime( $file ) ), $url );
		}

		// should use 'preload' here b/c FF doesn't support 'modulepreload' yet?
		// but that has it's own problems for preloading modules?
		printf( '<link rel="modulepreload" href="%s" />', $url );
	}
}
