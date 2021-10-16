/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, Notice } = wp.components;
const { Fragment } = wp.element;
const html = wp.html;

/**
 * Internal dependencies
 */
import { getLoadPath, getBaseUrl } from '../utilities.js';

export function DeveloperExperience() {
	const loadPath = getLoadPath();
	const watching = 'object' === typeof import.meta?.hot; // replcae w/ utility function
	const componentUrl = getBaseUrl() + '/developer-experience';

	return html`
		<${Fragment}>
			<!-- is this the best practice w/ http2 and react components? should preload? -->
			<link rel="stylesheet" href="${ componentUrl }/developer-experience.css" />

			<${ Card } id="developer-experience">

				<${ CardHeader }>
					Developer Experience Enhancements
				<//>

				<${ CardBody }>
					<${Fragment}>
						<div className="card-description">
							<p>
								This card describes optional developer experience enhancements that are available when the <code>watch</code> task is running.
							</p>

							<p>
								<strong>Hot Module Reloading:</strong> Saving changes to JS and CSS files will automatically trigger a page refresh.
							</p>

							<p>
								<strong>PostCSS:</strong> You can use things that browsers don't support natively, like nesting rules.
								That will prevent you from using the <code>source/</code> files directly, though.
								Alternatively, you can use PostCSS solely in production optimizations, while still using the <code>source/</code> files during development.
							</p>
						</div>

						<${ Notice } status="info" isDismissible=${ false } >
							${ 'source' === loadPath && ! watching && html`
								<p>
									You're running from <code>source/</code> without the <code>watch</code> task, so the nested styles won't apply, and the image below will be blurred.

									<code>npm run watch</code> or <code>npm run build</code> and then refresh. That will cause PostCSS to transform the nested styles to vanilla CSS, and un-blur the image.
								</p>
							` }

							${ watching && html`
								<p>
									You're running the <code>watch</code> task, so the nested styles <em>will</em> apply, and the image below will <strong>not</strong> be blurred.

									<code>Control-C</code> in your terminal to cancel the watch task, then refresh to load the unprocessed files. When you do, the image will be blurred.
								</p>
							` }

							${ 'build' === loadPath && html`
								<p>
									You're running from <code>build/</code>, so the nested styles <em>will</em> apply, and the image below will <strong>not</strong> be blurred.

									Run <code>rm -rf build/</code> and refresh to load the <code>source/</code> styles, where which transformed by PostCSS.
								</p>
							` }
						<//>

						<img src="${ componentUrl }/code-is-poetry-2x.png" alt="Code is Poetry" />
					</${Fragment} />
				</${CardBody}>
			</${Card}>
		</${Fragment} />
	`;
}
