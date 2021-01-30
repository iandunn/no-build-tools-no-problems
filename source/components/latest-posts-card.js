/**
 * WordPress dependencies
 */
const { Button, Card, CardHeader, CardBody } = window.wp.components;
const { Component } = window.wp.element;
const html = window.wp.html;

/**
 * Internal dependencies
 */
import { PostList } from './post-list.js';


export class LatestPostsCard extends Component {
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
			// todo replace w/ actual apiFetch() to make sure there aren't any real-world complexities that this is bypassing
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
			<${ Card }>
				<${ CardHeader }>
					Latest Posts
				<//>

				<${ CardBody }>
					<p>
						this shows some interactivity, you can use gutenberg components like apiFetch, Card, etc
					</p>

					${ ( loaded || loading ) && PostList( { posts, loading } ) }

					<${ Button } isPrimary onClick=${ this.fetchPosts }>
						${ loaded ? 'Reload' : 'Load' }
					<//>
				<//>
			<//>
		`;
	}
}
