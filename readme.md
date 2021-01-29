# No Build Tools, No Problems

Experiment building a WordPress-centric React app without any build tools. A vision for how much simpler life could be.


### Dev Environment

1. Activate the plugin
1. Open a`.js` file
1. Make changes
1. Refresh

Seriously, that's it 🥃 🍰

_( at least, in theory. let's find out what the real-world tradeoffs and limitations are... )_

The stuff in `package.json`, etc are optional enhancements (see below).


### Production Environment

You can run the same `source/` scripts in production if you'd like. For smaller projects, or new-to-JS devs, that can be a great entry point.

As your project grows, you may want to add a build step to optimize performance or support older browsers. It's optional, though.

1. Change `USE_BUILD_STEP` in `plugin.php` to `true`
1. `npm install`
1. `npm run build`
1. Deal with all the normal build tool problems 😞🙁😖🥃😩😢🥃😭😡🥃🤬🥃🥃🥃🥱🛌💤


### Why

Build tools are the worst part of modern JavaScript. They create a large barrier for new-to-JS devs, and are a recurring pain to set up and use regardless of experience level. They break randomly for opaque reasons, and which difficult to diagnose and fix.

They've also been totally unnecessary for years, but we're still stuck with ["complexity stockholm syndrome"](https://www.pika.dev/blog/pika-web-a-future-without-webpack).

If we want the vast majority of WP developers to build rich JS applications, then we need to [make it as simple as possible to get started](https://iandunn.name/2019/12/26/the-simplest-way-to-build-a-gutenberg-block/). Most folks don't work at Automattic/10up/etc, and don't have the privilege of spending hundreds of hours learning over-engineered abstractions and lengthy toolchains _on top of ES6 and React_. WordPress got to 40% of the Web in large part because it was easy for hobbyists and tinkerers to hack on their sites with little knowledge, and [grow over time](https://www.gatsbyjs.com/docs/conceptual/gatsby-core-philosophy/#progressively-disclose-complexity) into professional developers.

Right now there's a big wall between most folks and building what they want, in the ways that we want them to build it. If we don't make it simple, the closest most devs will ever get to building a block is [ACF](https://www.advancedcustomfields.com/resources/blocks/).

That's not to hate on ACF, they've done a great thing by making it simple. But if we want folks to learn JS deeply, then we have to internalize the importance of simplicity. It's not until we do that that we'll be able to make modern JS development in WordPres something that's accessible to everyone.

xref https://github.com/WordPress/gutenberg/issues/25077
