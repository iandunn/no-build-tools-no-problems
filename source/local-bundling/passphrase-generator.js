/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody, Icon, Notice, RangeControl, Spinner, Tooltip } = wp.components;
const { Component, Fragment } = wp.element;

// this is required in each file? should just be in the root file?
//if ( import.meta.hot ) {
//	import.meta.hot.accept();
//}

/**
 * External dependencies
 */
const html = wp.html;

/*
 * Uncomment these imports and `npm run bundle` to test importing locally-bundled dependencies.
 */
//import { v4 as uuidv4 } from 'uuid';      // Native ESM
//import { argon2id }     from 'hash-wasm'; // Native ESM
// maybe change these to dynamic imports, so could flip the card on/off automatically based on import.meta.hot || build === path?

// todo convert these to import maps too, but need to wait until https://github.com/snowpackjs/snowpack/discussions/2548 is released
// then check if can destructure specific functions from any of these, since snowpack will be is bundling
// it may expose them when couldn't access before
// will have to `snowpack add {name}` or whatever for each
import entropy     from 'https://cdn.skypack.dev/pin/ideal-password@v2.3.0-EzuQ0ccAMXBpJsZehqE7/min/ideal-password.js';                     // CommonJS -> EMS
import diceware    from 'https://cdn.skypack.dev/pin/diceware-generator@v3.0.1-WULYULlcLeNCwJ34FCIG/min/diceware-generator.js';             // CommonJS -> EMS
import eff2016Long from 'https://cdn.skypack.dev/pin/diceware-wordlist-en-eff@v1.0.1-gEyH81Lqvk6JUjXKPVT4/min/diceware-wordlist-en-eff.js'; // CommonJS -> EMS


/**
 * Internal dependencies
 */
import { getBaseUrl } from '../utilities.js';


export class PassphraseGenerator extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			// The UUID isn't used in a meaningful way, it's just here an example of importing a native ES module.
			//
			// This check is only needed in a demo app, so we can demonstrate multiple approach all in one app.
			// A real world project could pick one approach and remove anything unrelated to that.
			userId: 'function' === typeof uuidv4 ? uuidv4() : 'error',
		}
	}

	// Set default state.
	// todo lifecyle has been renamed, update
	componentWillMount = () => {
		// ⚠️ This isn't fine-tuned, its just for demonstration purposes. These could be completely inaccurate in reality.
		entropy.config( {
			minAcceptable: 53,
			minIdeal: 65
		} );

		this.generate( 4 );
	}

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
		let hash = html`
			<${ Spinner } />
		`;

		if ( 'Spinner' === this.state?.hash?.type?.name ) {
			hash = 'Throttled, please try again.';
		}

		this.setState(
			{ numberOfWords, passphrase, strength, hash },
			() => this.setArgon2idHash( passphrase )
		);
	}

	async setArgon2idHash( password ) {
		// This check is only needed in a demo app, see above comments.
		if ( 'function' !== typeof argon2id ) {
			return;
		}

		let startTime;
		const tune = false; // Flip to true when testing.

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
			iterations: 20,  // ⚠️ This is dangerously low, just for demo purposes. Higher values would require debouncing the UI to avoid slow/unresponsive UI.
			hashLength: 32,  // In bytes.
			outputType: 'encoded', // Includes verification parameters.
		} );

		if ( tune ) {
			//console.log( { salt, key } );
			console.log( 'Elapsed time: ' + ( performance.now() - startTime ) + 'ms.' );
		}

		this.setState( { hash: key } );
	}

	render = () => {
		const { numberOfWords, passphrase, strength, hash, userId } = this.state;

		// This check is only needed in a demo app, see above comments.
		const dependenciesAvailable = 'function' === typeof uuidv4 && 'function' === typeof argon2id;
		// todo add others when they're loaded from local bundle

		const componentUrl = getBaseUrl() + '/local-bundling';

		return html`
			<${Fragment}>
				<link rel="stylesheet" href="${ componentUrl }/local-bundling.css" />

				<${ Card } id="passphrase-generator">
					<${ CardHeader }>
						Dependencies via Local Bundling

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
								<p>
									This card demonstrates importing dependencies from a local bundle instead of a remote CDN, but without any <code>watch</code> tooling.
								</p>

								<p>
									Local bundles necessitate <em>some</em> tooling for package management, but <a href="https://www.snowpack.dev/">Snowpack</a> ${ ' ' }
									is designed for unbundled development, so you only have to run the <code>bundle</code> task when you add, update, or remove a dependency.
									It'll do tree-shaking, up-convert ES modules, and has a much more ergonomic lock file.
								</p>

								<p>
									Tooling like this should never be <em>required</em>, but it should be <em>supported</em> as an optional enhancement, since many will want it.
								</p>
							</div>

							${ ! dependenciesAvailable && html`
								<${ Notice } status="info" isDismissible=${ false } >
									<p>To see this card working, please:</p>

									<ol>
										<li><code>npm run bundle</code></li>
										<li>Uncomment the <code>import</code> statements at the top of this file.</li>
									</ol>
								<//>
							` }

							${ dependenciesAvailable && html`
								<${Fragment}>
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
										max=7
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
											<!-- Technically the score goes to infinity, but this is a reasonable max in
											     practice, and helps users put potential passphrases in perspective. -->
											${ ' ' } (${ Math.round( strength.score ) } / 100 )
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
							` }
						</${Fragment}>
					</${CardBody}>
				</${Card}>
			</${Fragment}>
		`;
	}
}
