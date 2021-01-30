# No Build Tools, No Problems

An experiment building a WordPress-centric React app without any build tools.

A vision for how much simpler life could be. _At least, in theory. Let's find out what the real-world tradeoffs and limitations are..._


### Dev Environment

1. Activate the plugin
1. Open a`.js` file
1. Make changes
1. Refresh

Seriously, that's it. 🥃 🍰

You can write standard React components with ES6, ES modules, and use any of the components/packages that Gutenberg provides. The only difference is that you'll write templates with [HTM](https://github.com/developit/htm) instead of JSX.


### Production Environment

You can run the same `source/` scripts in production if you'd like. For smaller projects, or new-to-JS devs, that can be a great entry point.

If that's where you're at, you can `rm .gitignore babel.config.js package.json package-lock.json`, and revel in how tidy your root folder is.

If you're building a large or CPU-intensive project, want to integrate CommonJS modules, or need to support older browsers, then you can add a build step for production files. You'll still be able to develop locally without any `watch` tooling, though.

1. `npm install`
1. `npm run build`
1. Deal with all the normal build tool problems  🙁😞😖🥃😩😢🥃😭😡🥃🤬🥃🥃🥃🥱🛌💤🔁
1. Once the transpiled files exist in `build/`, the plugin will automatically switch to enqueue them instead of `source/`. That lets you test them before deploying to production.
1. Once you're done testing, `rm -rf build/*`, and the `source/` files will automatically be enqueued again.


### Why

Build tools are the worst part of modern JavaScript. They create a large barrier for new-to-JS devs, and are a recurring pain to set up and use regardless of experience level. They break randomly for opaque reasons, which are difficult to diagnose and fix.

They've also been totally unnecessary for years, but we're still stuck with ["complexity stockholm syndrome"](https://www.pika.dev/blog/pika-web-a-future-without-webpack).

If we want the vast majority of WP developers to build rich JS applications, then we need to [make it as simple as possible to get started](https://iandunn.name/2019/12/26/the-simplest-way-to-build-a-gutenberg-block/). Most folks don't work at Automattic/10up/etc, and don't have the privilege of spending hundreds of hours learning over-engineered abstractions and lengthy toolchains _on top of ES6 and React_. WordPress got to 40% of the Web in large part because it was easy for hobbyists and tinkerers to hack on their sites with very little knowledge, and then [grow over time](https://www.gatsbyjs.com/docs/conceptual/gatsby-core-philosophy/#progressively-disclose-complexity) into professional developers.

Right now there's a big wall between most folks and building what they want, in the ways that we want them to build it. If we don't make it simple, the closest that most devs _(and their users)_ will ever get to the promise of Gutenberg is [blocks built in PHP](https://www.advancedcustomfields.com/resources/blocks/).

That's not to hate on ACF, they've done a great thing by making it simple. But if we want folks to learn build seamless dynamic interfaces, then we have to internalize the importance of simplicity again. Until we re-learn that lesson, we won't be able to make modern JS development in WordPress something that's accessible to everyone.


### Help Wanted

Right now this is just a proof-of-concept. Fork it and play around with it, see if it's useful in some real-world projects, etc. Give feedback by [reporting bugs & feature requests](https://github.com/iandunn/no-build-tools-no-problems/issues), and [starting discussions](https://github.com/iandunn/no-build-tools-no-problems/discussions). What kinds of problems or limitations do you run into? What's needed to make this live up to the vision?

if we can get this approach working well for a range of small/medium-sized plugins, then we can make a proposal for Core to support it, so that everything in `core.php` and `core.js` will be provided automatically.
