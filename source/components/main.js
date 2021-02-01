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
	const loadPath  = scriptUrl.indexOf( '/source/' ) ? 'source' : 'build';

	return html`
		<div className="wrap">
			<h1>No Build Tools, No Problems</h1>

			${ 'source' === loadPath && html`
				<${ Fragment }>
					<p>
						Currently serving files from <code>source/</code> (and <code>jspm.dev</code>), for the optimal developer experience.
					</p>

					<p>
						You can also <code>npm run build</code> to build optimized files for production, but it's not required.
					</p>
				<//>
			` }

			${ 'build' === loadPath && html`
				<p>
					Currently serving files from <code>build/</code> (and <code>jspm.dev</code>), for optimal performance and browser support.
				</p>

				<p>
					It's only necessary to test these before you deploy to production, or tag a release.

					Run <code>rm -rf build/</code> to switch back to using <code>source/</code> files.
				</p>
			` }
			<!--
			todo shouldn't serve jspm.dev when build, should bundle actual packages. that'd require import maps shim

			also update instructions for rm -fr build/* - maybe just delete build/index.js, b/c want to keep build/vendor.js and serve that alongside first-party source files?

			also note that you'll have to run npm install, and npm build whenever you change a dependency
			-->

			<div className="cards-container">
				<${LatestPostsCard} />

				<!-- add another card, example of importing _ES_ module that has dependencies.
				important that it has deps b/c that's complexity that has to be accounted for or not real-world poc
				-->

				<${Charts} />

				<${PassphraseGenerator} />
			</div>
		</div>
	`;
}
