/**
 * WordPress dependencies
 */
const { Button, Card, CardHeader, CardBody, CardFooter, Spinner } = window.wp.components;
const { createElement, Component } = window.wp.element;


/**
 * External dependencies
 */
import htm from '../../node_modules/htm/dist/htm.module.js';

const html = htm.bind( createElement );
	// eventually should just be registered as a script in wp, so Core could provide it to everyone
	// how to import it from then, though?
	// maybe could  /wp-includes/js/htm.js or whatever, but that's hardcoding path, which wouldn't work in all case
	// need to make a global `window.htm` var accessible or something, same as window.wp.components?


/**
 * Internal dependencies
 */
import { PostList } from './post-list.js';

export class LatestPostsCard extends Component {
	/**
	 * Initialize the component.
	 *
	 * @param {Array} props
	 */
	constructor( props ) {
		super( props );

		this.state = {
			loading: false,
			loaded: false,
			posts: [],
		 };

		this.fetchPosts = this.fetchPosts.bind( this );
	}

	fetchPosts() {
		this.setState( { loading: true }, () => {
			// simulate fetching from api
			const timerID = setTimeout( () => {
				this.setState( {
					loading: false,
					loaded: true,
					posts: [
						{
							id: 1,
							title: "Hello World",
						},

						{
							id: 2,
							title: "Goodbye World",
						},
					],
				} );
			}, 700 )
		} );
	}

	render() {
		const { loaded, loading, posts } = this.state;

		return html`
			<div className="wrap">
				<h1>No Build Tools, No Problems</h1>

				<${ Card } width="500">
					<!-- width not working, how to pass in correctly? 'size' param instead?-->

					<${ CardHeader }>
						Latest Posts
					<//>

					<${ CardBody }>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
						</p>

						${ ( loaded || loading ) && PostList( { posts, loading } ) }

						<${ Button } isPrimary onClick=${ this.fetchPosts }>
							${ loaded ? 'Reload' : 'Load' }
						<//>
					<//>
				<//>
			</div>
		`;

		// create some other components too, to show working w/ multiple components
		// look at quick-nav-int and comp-comments for some examples
		// also look at storybook for some ideas of existing components to use
		// button
		// card
	}
}
