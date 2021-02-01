/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, Icon, Notice, RangeControl, Tooltip } = wp.components;
const { Component, Fragment } = wp.element;
const html = wp.html;
const { shuffle } = lodash;

import { v4 as uuidv4 } from 'https://jspm.dev/uuid@8.3';
	// add subpath ?
import entropy from 'https://jspm.dev/npm:ideal-password@2.3';
import diceware from 'https://jspm.dev/npm:diceware-generator@3.0';
import eff2016Long from 'https://jspm.dev/npm:diceware-wordlist-en-eff@1.0';

// maybe if use import maps shim and: import { v4 as uuidv4 } from 'uuid';

// is there a simpler solution? maybe just a build script that copies dependencies into build/, and `import` by path?
// maybe have webpack bundle _only the dependencies_ ? or use snowpack to do it & convert cjs to esj?



export class PassphraseGenerator extends Component {
	constructor( props ) {
		super( props );
	}

	// Set default state.
	componentWillMount = () => {
		// ⚠️ This isn't fine-tuned, its just for demonstration purposes. These could be completely inaccurate in reality.
		entropy.config( {
			minAcceptable: 50,
			minIdeal: 65
		} );

		this.generate( 4 );
	}

	// todo replace stubs w/ ES & CJS modules
	generate = ( numberOfWords ) => {
		const passphrase = diceware( {
			language  : eff2016Long,
			wordcount : numberOfWords,
			format    : 'string'
		} );

		const score = entropy( passphrase );

		let strength = {
			score: score.entropy,
			label: 'Very Weak',
		};

		if ( score.ideal ) {
			strength.label = 'Ideal';
		} else if ( score.acceptable ) {
			strength.label = 'Acceptable';
		}

		const userId = uuidv4();
		const hash = shuffle( 'abcdefghijklmopqrstuvwxyz1234567890' ).concat( userId ); // simulating a salt
			// stub. use https://www.npmjs.com/package/secure-password (cjs, has deps); or https://www.npmjs.com/package/argon2 (cjs, has deps)
			// those are both node-dependent. need to find one that works in browser. maybe no argon will, so use a weaker one like sha512 or 256
			// or maybe bcrypt, but note that it's old

		this.setState( { numberOfWords, passphrase, strength, hash } )
	}

	render = () => {
		const { numberOfWords, passphrase, strength, hash } = this.state;
		const dependenciesAvailable = true; // todo detect automatically based on the the prescense of window.diceware, etc

		return html`
			<${ Card } id="passphrase-generator">
				<${ CardHeader }>
					Passphrase Generator

					<!-- todo update if find more secure than bcrypt -->
					<${Tooltip}
					    text="
					        Don't use this as your actual password generator.
					        This is just for demonstration purposes. bcrypt isn't a modern hashing algorithm, and the entropy scoring hasn't been fine-tuned.
					    "
					    position="top left"
					>
						<div className="security-purpose-warning">
							<${Icon} icon="warning" size="36" />
						</div>
					<//>
				<//>

				<${ CardBody }>
					<${ Fragment }>
						<div className="card-description">
							<${ Notice } status="warning" isDismissible=${ false } className="WIP">
								This is still a work in progress.
							<//>

							<p>
								This demonstrates importing dependencies from a local bundle, including CommonJS packages that are up-converted to ES modules.
							</p>

							<p>
								That should never be <em>required</em>, but it should be <em>supported</em> as an optional enhancement, since many will want it.
							</p>

							${ ! dependenciesAvailable && html`
								<${ Notice } status="error" isDismissible=${ false } >
									You'll need to <code>npm run build</code> to see this card working.
								<//>
							` }
						</div>

						<${ RangeControl }
							className="number-of-words"
							label="Number of Words"
							marks=${ true }
							max=8
							min=3
							value=${ numberOfWords }
							onChange=${ value => this.generate( value ) }
						/>

						<p>
							<strong>Passphrase:</strong> ${ passphrase }
						</p>

						<p>
							<strong>Strength:</strong> ${ ' ' }
							<span className="passphrase-strength-label ${ strength.label.toLowerCase().replace( ' ', '-' ) }">
								${ strength.label }
							</span>

							<span className="passphrase-score">
								<!-- Technically the score goes to infinity, but this is a reasonable max, and helps users understand. -->
								${ ' ' } (${ Math.round( strength.score ) } / 128)
							</span>
						</p>

						<p>
							<strong>bcrypt hash:</strong>
							<span className="passphrase-hash">
								<code>
									${ hash }
								</code>
							</span>
						</p>
					</${Fragment}>
				</${CardBody}>
			</${Card}>
		`;
	}
}
