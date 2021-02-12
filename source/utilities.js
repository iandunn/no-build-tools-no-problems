// Returns something like `https://example.org/wp-content/plugins/no-build-tools-no-problems/`
export function getBaseUrl() {
	const scriptUrl = document.getElementById( 'no-build-tools-no-problems-js' ).getAttribute( 'src' );

	return scriptUrl.substring( 0, scriptUrl.lastIndexOf( '/' ) );
}

// Returns 'build' if loaded from `build/` folder, 'source' otherwise
export function getLoadPath() {
	const scriptUrl = document.getElementById( 'no-build-tools-no-problems-js' ).getAttribute( 'src' );

	// Not using Snowpack's `.env` file because `__SNOWPACK_ENV__` wouldn't exist when loading from `source/`.
	// Could check for that, but this approach is consistent with `get_serve_file()` in `plugin.php`.
	return scriptUrl.indexOf( '/build/' ) > 0 ? 'build' : 'source';
}
