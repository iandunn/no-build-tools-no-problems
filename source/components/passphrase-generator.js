/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, Notice, RangeControl } = wp.components;
const { Component, Fragment } = wp.element;
const html = wp.html;
const { shuffle } = lodash;

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
// todo it has an es module. import it from local install, but need it bundled into build dir? see #1
// maybe if use import maps shim and: import { v4 as uuidv4 } from 'uuid';
// is there a simpler solution? maybe just a build script that copies dependencies into build/, and `import` by path?
// maybe have webpack bundle _only the dependencies_ ? or use snowpack to do it & convert cjs to esj?


export class PassphraseGenerator extends Component {
	constructor( props ) {
		super( props );
	}

	componentWillMount = () => {
		this.generate( 6 );
	}

	// todo replace stubs w/ ES & CJS modules
	generate = ( numberOfWords ) => {
		const stubWords = 'correct horse battery staple tacos quesadillas enchiladas ramones clash operation ivy';
		const passphrase = shuffle( stubWords.split( ' ' ) ).slice( 0, numberOfWords ).join( ' ' );
			// stub. use eff-diceware-passphrase - cjs, has deps

		const stubKey = Math.round( Math.random() * ( 3 - 0 ) + 0 );
		const strength = [ 'Low', 'Medium', 'High', 'Ideal' ][ stubKey ];
			// stub. use https://www.npmjs.com/package/ideal-password - cjs, has deps

		const userId = uuidv4();
		const hash = shuffle( 'abcdefghijklmopqrstuvwxyz1234567890' ).concat( userId ); // simulating a salt
			// stub. use https://www.npmjs.com/package/secure-password (cjs, has deps); or https://www.npmjs.com/package/argon2 (cjs, has deps)

		this.setState( { numberOfWords, passphrase, strength, hash } )
	}

	render = () => {
		const { numberOfWords, passphrase, strength, hash } = this.state;

		const dependenciesAvailable = true; // stub. need to put in state and avoid generate() ?

		return html`
			<${ Card }>
				<${ CardHeader }>
					Passphrase Generator
				<//>

				<${ CardBody }>
					${ ! dependenciesAvailable && html`
						<${ Notice } status="error" isDismissible=${ false } >
							This card relies on 3rd party dependencies, please run <code>npm install</code> to use it.
						<//>
					` }

					${ dependenciesAvailable && html`
						<${ Fragment }>
							<p>
								This will show a mix of imported ES and CommonJS modules (with dependencies), for additional testing.
							</p>

							<${ RangeControl }
								label="Number of Words"
								marks=${ true }
								max=10
								min=3
								value=${ numberOfWords }
								onChange=${ value => this.generate( value ) }
							/>

							<p>
								<strong>Passphrase:</strong> ${ passphrase }
							</p>

							<p>
								<strong>Strength:</strong> ${ ' ' }
								<span className="passphrase-strength ${ strength.toLowerCase() }">
									${ strength }
								</span>
							</p>

							<p>
								<strong>argon2 hash:</strong>
								<span className="passphrase-hash">
									<code>
										${ hash }
									</code>
								</span>
							</p>
						<//>
					` }
				<//>
			<//>
		`;
	}
}
