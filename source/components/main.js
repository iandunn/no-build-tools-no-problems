/**
 * WordPress dependencies
 */
const html = wp.html;
const { Fragment } = wp.element;


/**
 * Internal dependencies
 */
import { LatestPostsCard } from './latest-posts-card.js';
import { Charts } from './charts.js';
import { PassphraseGenerator } from './passphrase-generator.js';

export function MainView() {
	const scriptUrl = document.getElementById( 'no-build-tools-no-problems-js' ).getAttribute( 'src' );

	// Not using Snowpack's `.env` file because `__SNOWPACK_ENV__` wouldn't exist when loading from `source/`.
	// Could check for that, but this approach is consistent with `get_serve_file()` in `plugin.php`.
	const loadPath = scriptUrl.indexOf( '/build/' ) > 0 ? 'build' : 'source';

	return html`
		<div className="wrap">
			<h1>No Build Tools, No Problems</h1>

			${ 'source' === loadPath && html`
				<${ Fragment }>
					<p>
						Currently serving files from <code>source/</code>, for the optimal developer experience.
					</p>

					<p>
						You can also <code>npm run build</code> to build optimized files for production, but it's not required.
					</p>
				<//>
			` }

			${ 'build' === loadPath && html`
				<p>
					Currently serving files from <code>build/</code>, for optimal performance and browser support.
				</p>

				<p>
					It's only necessary to test these before you deploy to production, or tag a release.

					Run <code>rm -rf build/</code> to switch back to using <code>source/</code> files.
				</p>
			` }

			<div className="cards-container">
				<${LatestPostsCard} />

				<${Charts} />

				<${PassphraseGenerator} />
			</div>
		</div>
	`;
}
