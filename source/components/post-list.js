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
