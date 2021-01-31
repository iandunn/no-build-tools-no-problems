/**
 * WordPress dependencies
 */
const { Spinner } = window.wp.components;
const html = window.wp.html;

export function PostList( { posts, loading } ) {
	if ( loading ) {
		return html`
			<div>
				<${ Spinner } />
			</div>
		`;
	}

	if ( ! posts.length ) {
		return html`<p>No posts available.</p>`;
	}

	return html`
		<ul>
			${ posts.map( post => html`
				<li key="${ post.id }">
					<a href="${ post.link }">
						${ post.title.rendered }
					</a>
				</li>
			` ) }
		</ul>
	`;
}
