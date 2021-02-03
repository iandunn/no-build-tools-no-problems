/**
 * WordPress dependencies
 */
const { Button, Card, CardHeader, CardBody } = wp.components;
const { Fragment } = wp.element;
const html = wp.html;

import { Doughnut } from 'https://cdn.skypack.dev/pin/react-chartjs-2@v2.11.1-cGAzf4xxUMTbCCM54GCt/min/react-chartjs-2.js';
	// subpath?
import confetti from 'https://cdn.skypack.dev/pin/canvas-confetti@v1.3.3-ySRaL53MTwssL5KYsZu8/min/canvas-confetti.js';

// maybe load dynamically imports, and render a spinner in the meantime?

export function Charts() {
	const data = getData();
	const colors = [ '#a8e0ff', '#8ee3f5', '#70cad1', '#3e517a', '#b08ea2', '#BBB6DF' ];

	return html`
		<${ Card }>
			<${ CardHeader }>
				Charts
			<//>

			<${ CardBody }>
			    <${ Fragment }>
					<p className="card-description">
						This card is an example of importing modules via <a href="https://skypack.dev/">cdn.skypack.dev</a>, bypassing the need for any local bundling.
					</p>

					<p>
						CommonJS modules are automatically up-converted to a ES modules, so you can use with a native <code>import</code> for everything.
						Using <a href="https://docs.skypack.dev/skypack-cdn/api-reference/pinned-urls-optimized">a "pinned" URL</a> gets you code that's optimized for production usage.

						${ ' ' }
						<${ Button } isLink onClick=${ confetti } >
							Huzzah!
							<!-- todo doesn't work in chrome, throws exception
							switch to unminified and use chrome debugger
							-->
						<//>
					</p>

					<${ Doughnut }
						data=${ data }
						colors=${ colors }
					/>
				<//>
			<//>
		<//>
	`;
}

// https://github.com/reactchartjs/react-chartjs-2/blob/react16/example/src/charts/Doughnut.js
function getData() {
	return {
		labels: [ 'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange' ],
		datasets: [
			{
				label: '# of Votes',
				data: [ 12, 19, 3, 5, 2, 3 ],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
		],
	};
}
