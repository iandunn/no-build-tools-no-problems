/**
 * WordPress dependencies
 */
const { Button, Card, CardHeader, CardBody } = window.wp.components;
const html = window.wp.html;

export function Charts( {  } ) {
	return html`
		<${ Card }>
			<${ CardHeader }>
				Charts
			<//>

			<${ CardBody }>
				<p>
					this will show how you can import a CommonJS module from NPM, but import it like an ESM
					thanks to Snowpack [link]
				</p>

				<div>
					some fancy chart here
				</div>
			<//>
		<//>
	`;
}
