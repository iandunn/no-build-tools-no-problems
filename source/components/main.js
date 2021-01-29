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

			<div class="cards-container">
				<${LatestPostsCard} />

				<${Charts} />
			</div>
		</div>
	`;
}
