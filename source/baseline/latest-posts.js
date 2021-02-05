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
			<${ Card } id="latest-posts">
				<${ CardHeader }>
					Modern Browsers Without Tooling
				<//>

				<${ CardBody }>
					<div className="card-description">
						<p>
							This card demonstrates the baseline of how ES6, React, JSX-like templating, modern CSS, and Gutenberg components can all be used without any tooling.
						</p>

						<p>
							<code><a href="https://wordpress.github.io/gutenberg/?path=/story/components-button--primary">Button</a></code> and
							<code><a href="https://github.com/WordPress/gutenberg/blob/056dd36/packages/api-fetch/README.md">apiFetch</a></code> are used below.
							All of the cards on this page use <a href="https://wordpress.github.io/gutenberg/?path=/story/components-card--default"><code>Card</code></a> as well.
							No third-party dependencies are needed beyond what Core currently provides, or easily could in the future.
						</p>
					</div>

					${ ( loaded || loading ) && PostList( { posts, loading } ) }

					<${ Button } isPrimary onClick=${ this.fetchPosts }>
						${ loaded ? 'Reload' : 'Load Posts' }
					<//>
				<//>
			<//>
		`;
	}
}
