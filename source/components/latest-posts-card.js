/**
 * WordPress dependencies
 */
const { Button, Card, CardHeader, CardBody } = wp.components;
const { Component } = wp.element;
const html = wp.html;
const apiFetch = wp.apiFetch;

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

	fetchPosts = () => {
		this.setState( { loading: true }, async () => {
			const postQueryParams = new URLSearchParams( {
				_fields: 'id,title,link',
				per_page: 5,
			} );

			const fetchParams = {
				path : '/wp/v2/posts?' + postQueryParams.toString(),
			};

			const posts = await apiFetch( fetchParams );

			this.setState( {
				loading: false,
				loaded: true,
				posts,
			} );
		} );
	}

	render = () => {
		const { loaded, loading, posts } = this.state;

		return html`
			<${ Card }>
				<${ CardHeader }>
					Latest Posts
				<//>

				<${ CardBody }>
					<p>
						This shows using some components/utilities bundled with WordPress/Gutenberg, like <code>Button</code> and <code>apiFetch</code>.
					</p>

					<p>
						All of the cards on this page use <a href="https://wordpress.github.io/gutenberg/?path=/story/components-card--default"><code>Card</code></a> as well.
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
