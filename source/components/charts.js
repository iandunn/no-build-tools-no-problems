/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, Notice } = wp.components;
const { Fragment } = wp.element;
const html = wp.html;

import { Doughnut } from 'https://jspm.dev/npm:react-chartjs-2@2.11.1';

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
						This is an example of importing a CommonJS module via <a href="https://jspm.org/">jspm.dev</a>, bypassing the need for any local bundling.
						It's automatically up-converted to an ES module that you can use with a native <code>import</code>.
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
