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
	// add StrictMode
	return html`
		<${ Fragment }>
			<${LatestPostsCard} />

			<${Charts} />

			<${PassphraseGenerator} />
		<//>
	`;
}
