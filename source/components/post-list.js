/**
 * WordPress dependencies
 */
const { Spinner } = window.wp.components;
const { createElement } = window.wp.element;


/**
 * External dependencies
 */
import htm from '../../node_modules/htm/dist/htm.module.js';

const html = htm.bind( createElement );

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
