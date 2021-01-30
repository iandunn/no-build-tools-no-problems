/**
 * WordPress dependencies
 */
const html = window.wp.html;

/**
 * Internal dependencies
 */
import { LatestPostsCard } from './latest-posts-card.js';
import { Charts } from './charts.js';
import { PassphraseGenerator } from './passphrase-generator.js';

export function MainView() {
	return html`
		<div className="wrap">
			<h1>No Build Tools, No Problems</h1>

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
