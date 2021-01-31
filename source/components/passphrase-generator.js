/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, RangeControl } = window.wp.components;
const { Component } = window.wp.element;
const html = window.wp.html;
const { shuffle } = window.lodash;

//import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; todo tmp
//console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

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
			// stub. use eff-diceware-passphrase

		const stubKey = Math.round( Math.random() * ( 3 - 0 ) + 0 );
		const strength = [ 'Low', 'Medium', 'High', 'Ideal' ][ stubKey ];
			// stub. use https://www.npmjs.com/package/ideal-password - commonjs, has deps

		const userId = shuffle( 'abcdefghijklmopqrstuvwxyz' ).splice( 0, 12 );
			// stub, use `uuid` package

		const hash = shuffle( 'abcdefghijklmopqrstuvwxyz1234567890' ).concat( userId ); // simulating a salt
			// stub. use https://www.npmjs.com/package/secure-password or https://www.npmjs.com/package/argon2 probably

		this.setState( { numberOfWords, passphrase, strength, hash } )
	}

	render = () => {
		const { numberOfWords, passphrase, strength, hash } = this.state;

		return html`
			<${ Card }>
				<${ CardHeader }>
					Passphrase Generator
				<//>

				<${ CardBody }>
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
						<strong>argon2 hash:</strong> <code>${ hash }</code>
					</p>
				<//>
			<//>
		`;
	}
}
