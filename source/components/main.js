/**
 * WordPress dependencies
 */
const html = window.wp.html;

/**
 * Internal dependencies
 */
import { LatestPostsCard } from './latest-posts-card.js';
import { Charts } from './charts.js';

export function MainView() {
	return html`
		<div className="wrap">
			<h1>No Build Tools, No Problems</h1>

			<div className="cards-container">
				<${LatestPostsCard} />

				<${Charts} />

				<!-- add another card, example of importing ES module that has dependencies. update text for above to be example of CJS module w/ dependencies.
				important that it has deps b/c that's complexity that has to be accounted for or not real-world poc
				-->
			</div>
		</div>
	`;
}
