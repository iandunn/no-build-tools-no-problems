/**
 * WordPress dependencies
 */
const { Spinner } = window.wp.components;
const html = window.wp.html;

export function PostList( { posts, loading } ) {
	if ( loading ) {
		return html`
			<div>
				<p>loading...</p>

				<${ Spinner } />
				<!-- todo why isn't ^ working?  remove "loading" once it is
				the markup is there, but the spinner image isn't, so it's a css issue or something? or needs a specific container?
				 -->
			</div>
		`;
	}

	return html`
		<ul>
			${ posts.map( post => html`
				<li key="${ post.id }">
					${ post.title }
				</li>
			` ) }
		</ul>
	`;
}
