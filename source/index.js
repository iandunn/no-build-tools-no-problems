/**
 * WordPress dependencies
 */
const html = wp.html;
const { Fragment } = wp.element;
const { renderLoadingContainer } = wp.utils;

// This is required for HMR to work, because we're using WP to serve the HTML instead of Snowpack's localhost server.
if ( import.meta.hot ) {
	import.meta.hot.accept();
}

/**
 * Internal dependencies
 */
import { LatestPostsCard } from './baseline/latest-posts.js';
import { Charts } from './charts.js';
import { PassphraseGenerator } from './local-bundling/passphrase-generator.js';
import { DeveloperExperience } from './developer-experience/developer-experience.js';

renderLoadingContainer(
	'nbtnp-cards-container',
	function() {
		// add StrictMode
		return html`
			<${ Fragment }>
				<${LatestPostsCard} />

				<${Charts} />

				<${PassphraseGenerator} />

				<${DeveloperExperience} />
			<//>
		`;
	},
	{}
);
