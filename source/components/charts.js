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
					This will be an example of importing a CommonJS module from NPM. It'll be up-converted to an ES module that you can use with a native <code>import</code>.
				</p>

				<!-- todo put chart here after solve importing problem -->
			<//>
		<//>
	`;
}
