<?php

namespace No_Build_Tools_No_Problems\Core;

/*
 * These are things that Core could provide to plugins
 */

add_action( 'admin_enqueue_scripts', function() {
	// this would eventually be wp-includes/js/dist/htm.js or whatever.
	// have to use unpckg b/c skypack is always an ESM, but want an IIFE in this scenario
	wp_register_script(
		'htm',
		'https://unpkg.com/htm@3.0.4/dist/htm.js',
		array(),
		null, // Don't modify the URL, that will break unpkg's parsing.
		true
	);

	wp_register_script(
		'nbtnp-core',
		plugins_url( 'core/core.js', __DIR__ ),
		array( 'wp-element' ),
		filemtime( dirname( __DIR__ ) . '/core/core.js' )
	);
	wp_script_add_data( 'nbtnp-core', 'defer', true );

	// ⚠️ This doesn't support IE1. You need to run callers through Babel to bundle production code together.
	// @see https://github.com/guybedford/es-module-shims/issues/14
	wp_register_script(
		'es-module-shims',
		plugins_url( 'es-module-shims.js', __FILE__ ), // can't be loaded via skypack
		array(),
		'0.9.0'
	);
	wp_script_add_data( 'es-module-shims', 'defer', true ); // has to load _after_ the <script type="importmap-shim">
}, 9 );

/**
 * add type=module to script tag
 *
 * this is necessary for index.js to be able to `import` other files in the plugin
 *
 * workaround until https://core.trac.wordpress.org/ticket/12009 or https://core.trac.wordpress.org/ticket/22249 are fixed
 *
 * props georgestephanis, xref https://gist.github.com/georgestephanis/2a84bc55ad23f4dec2cf2464109add59
 * look at filter_script_loader_tag in twentywtety/wp-rig, prob better
 *
 * it may be better to just manually output them in the head, instead of bothering w/ enqueue system, but dependencies are helpful
 */
add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
	$scripts = wp_scripts();
	$obj     = $scripts->registered[ $handle ];

	// todo check that they're not already added

	if ( ! empty( $obj->extra['defer'] ) ) {
		$tag = str_replace( " src='$src'", " src='$src' defer", $tag );
	}

	if ( ! empty( $obj->extra['type'] ) ) {
		$tag = str_replace( " src='$src'", " src='$src' type='{$obj->extra['type']}' ", $tag );
	}

	return $tag;
}, 10, 3 );

// in place where this can't be called directly -- e.g., add_menu_page `callback` param -- you can use an
// an anonymous function to call it. adding `callback_args` params to functions like that would get rid
// of the need for a anon function
//
// This works in conjunction with `renderLoadingContainer()` on the JS side.
function __return_loading_container( $id ) {
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

// this prevents waterfall-loading in chrome
// other browsers don't support `modulepreload` yet :(
//
// maybe this isn't needed for local development b/c it's already fast enough?
// and it wouldn't be needed for prod b/c the build step would concat the files anyway, and this would load from the build/ folder
//
// call during wp_head and/or admin_head
	// better action?
// ideally would just wp_enqueue_script and automatically have type="module" and corresponding <link rel="preload" ...>
function preload_modules( $plugin_folder ) {
	// the order is important here, start w/ deepest depeendencies?
		// need to make this DRY with core.js, but depends on how it'll eventually be used there
	printf( '<link rel="modulepreload" href="https://cdn.skypack.dev/pin/htm@v3.0.4-eKPIliCVcHknqhs5clvp/min/htm.js" />' );

	$plugin_folder = untrailingslashit( $plugin_folder );

	// in real world applicatiosns we probably don't want to preload everything, but only the critical/top-level modules
	// this function could accept a param w/ an array of urls, or wp_enqueue_script could have a way of marking scripts as critical, etc
	$files = glob( $plugin_folder . "/{,*/,*/*/,*/*/*/}*.js", GLOB_BRACE );

	foreach ( $files as $file ) {
		$url = plugins_url( basename( $file ), $file );

		// enqueued files need the &ver= param so they match the enqueued url, imports don't
		$enqueued = in_array( basename( $file ), array( 'core.js', 'index.js' ), true );

		if ( $enqueued ) {
			// ideally wp_enqueue_script would handle this, so that the value is DRY & not tightly coupled between here and plugin.php
			$url = add_query_arg( 'ver', rawurlencode( filemtime( $file ) ), $url );
		}

		// should use 'preload' here b/c FF doesn't support 'modulepreload' yet?
		// but that has it's own problems for preloading modules?
		printf( '<link rel="modulepreload" href="%s" />', $url );
	}
}

add_action( 'admin_print_styles', function() {
	?>

	<style>
		/* Make it obvious that something is there, since the icon is easy to miss.
		Maybe replace this with a Calypso-style container with an animated box or something
		https://github.com/Automattic/wp-calypso/blob/f585663594c18ca24d582a637f0e303d1350a6c0/docs/reactivity.md
		*/
		.loading-content {
			height: 400px;
			background-color: #e8e8e8;
			border: 5px solid grey;
		}
	</style

	<?php
} );
