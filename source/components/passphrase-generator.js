/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, Icon, Notice, RangeControl, Spinner, Tooltip } = wp.components;
const { Component, Fragment } = wp.element;


/**
 * External dependencies
 */
const html = wp.html;
const { debounce } = window.lodash;

import { v4 as uuidv4 } from 'https://jspm.dev/uuid@8.3';                    // Native ESM
	// add subpath ?
import { argon2id } from 'https://jspm.dev/npm:hash-wasm@4.4';               // Native ESM
	// add subpath - want https://unpkg.com/browse/hash-wasm@4.4.1/dist/argon2.umd.min.js . update comment b/c this is UMD not ESM
import entropy from 'https://jspm.dev/npm:ideal-password@2.3';               // CommonJS -> EMS
import diceware from 'https://jspm.dev/npm:diceware-generator@3.0';          // CommonJS -> EMS
import eff2016Long from 'https://jspm.dev/npm:diceware-wordlist-en-eff@1.0'; // CommonJS -> EMS

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

		// The real value will take ~450ms to compute, so give the user visual feedback that something is happening.
		const hash = html`
			<${ Spinner } />
		`;

		this.setState(
			{ numberOfWords, passphrase, strength, hash },
			() => this.setArgon2idHash( passphrase )
		);
	}

	async setArgon2idHash( password ) {
		let startTime;
		const tune = true; // Flip to true when testing.

		if ( tune ) {
			startTime = performance.now();
		}

		const salt = new Uint8Array( 16 );
		window.crypto.getRandomValues( salt );

		/*
		 * These parameters should be tuned so that the calculation takes roughly 450ms, to balance security
		 * and UX.
		 *
		 * Changing the `parallelism` param will result in a different hash, so it can't be changed after
		 * any passwords are stored.
		 *
		 * @see https://www.alexedwards.net/blog/how-to-hash-and-verify-passwords-with-argon2-in-go
		 */
		const key = await argon2id( {
			password: password.normalize(), // @see https://github.com/Daninet/hash-wasm#string-encoding-pitfalls
			salt,
			parallelism: 1,
			memorySize: 512, // In kilobytes.
			//iterations: 75, // This is much lower than you'd want it in a real-world application.
			iterations: 20, // todo tmp, very low until debouncing implemented
			hashLength: 32, // In bytes.
			outputType: 'encoded', // Includes verification parameters.
		} );

		if ( tune ) {
			//console.log( { salt, key } );
			console.log( 'Elapsed time: ' + ( performance.now() - startTime ) + 'ms.' );
		}

		// todo when the range slider is changes quickly, these get backed up
		// is there a way to abort the previous requests and just process the latest one?
			// or just throttle/debounce?

		// once the queueing problem is solved, does that solve the UI being slow? or still need to work on htat?
			// try tweaking memorySize, see if that helps

		this.setState( { hash: key } );
	}

	render = () => {
		const { numberOfWords, passphrase, strength, hash } = this.state;
		const dependenciesAvailable = true; // todo detect automatically based on the the prescense of window.diceware, etc
		const userId = uuidv4(); // This isn't used in a meaningful way, it's just here an example of importing a native ES module.

		return html`
			<${ Card } id="passphrase-generator">
				<${ CardHeader }>
					Passphrase Generator

					<${Tooltip}
					    text="
					        ⚠️ Don't use this as your actual password generator.
					        This is just for demonstration purposes, and may not provide a secure passphrase, accurate entropy scores, etc.
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

						<p>
							<strong>User UUID:</strong>

							<code className="block">
								${ userId }
							</code>
						</p>

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
							<strong>Passphrase:</strong>
							<code className="block">
								${ passphrase }
							</code>
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
							<strong>Argon2id hash:</strong>
							<span className="passphrase-hash">
								<code className="block">
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
