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
	}

	render() {
		const { loaded, loading, posts } = this.state;

		return html`
			<${ Card } width="500">
				<!-- width not working, how to pass in correctly? 'size' param instead?-->

				<${ CardHeader }>
					header
				<//>

				<${ CardBody }>
					<${ Button } isPrimary onClick=${ () => this.setState( { loading: true } ) }>
						${ loaded ? 'Reload' : 'Load' }
					<//>

					${ ( loaded || loading ) && PostList( { posts, loading } ) }
					<!--	can call like <PostList /> inside expression like this? -->
				<//>

				<${ CardFooter }>
					feet
				<//>
			<//>
		`;
	}
}

// move to diff file
function PostList( { posts, loading } ) {

	if ( loading ) {
		// fetch from api
		// when have them, set loaded=true, loading=false, posts=data from api

		return html`
			<div>
				loading...
				<${ Spinner } />
				<!-- todo why isn't ^ working?  remove "loading" once it is
				the markup is there, but the spinner image isn't, so it's a css issue or something? or needs a specific container?
				 -->
			</div>
		`;
	}

	return html`
		<ul>
			<li key="1"> title </li>
		</ul>
	`;
}
