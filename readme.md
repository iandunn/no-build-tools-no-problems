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

If want to optimize performance, or need to support older browsers, then you can use the <code>build</code> step for your production files. You'll still be able to develop locally without any `watch` tooling, though.

1. `npm install`
1. `npm run build`
1. Deal with all the normal build tool problems  🙁 😞 😖 🥃 😩 😢 🥃 😭 😡 🥃 🤬 🥃 🥃 🥃 🥱 🛌 💤 🔁
1. Once the transpiled files exist in `build/`, the plugin will automatically switch to enqueue them instead of `source/`. That lets you easily test them before deploying to production.
1. Once you're done testing, `rm -rf build/*`, and the `source/` files will automatically be enqueued again.


### Third-Party Dependencies

There are two ways to import dependencies, depending on your needs and preferences.

1. **Modern CDN:** This method is the easiest, and avoids any need for tooling.

    [Skypack](https://www.skypack.dev/) is a remote CDN that's [designed for modern web apps](https://docs.skypack.dev/). It transparently up-converts modules to ESM, splits code into cacheable modules, tailors the package to every browser request to avoid unnecessary polyfills, etc.

1. **Locally bundled packages:** You can also bundle packages locally if you prefer, but still much faster and more conveniently than traditional approaches.

   [Snowpack](https://snowpack.dev) is used to generate bundles 10x faster than Webpack, and only when needed. You don't need to run the `watch` task, just `npm run bundle` when you add/remove a dependency. It still does tree-shaking, will automatically up-convert CommonJS modules to ESM, and has a much more ergonomic approach to package locking.


### Optional Tooling for Improved Developer Experience

<code>npm run watch</code> will add additional features, but it's not required.

* Today: Hot Module Reloading and PostCSS.
* Future: React Fast Refresh.


### Results

The plugin creates a wp-admin screen where it demonstrates what can be achieved without any tooling, and some optional enhancements if you do want some tooling.

[![Screenshot of the wp-admin page where features are demonstrated](.github/screenshot.png?raw=true)](.github/screenshot.png?raw=true)


### Why

Build tools are the worst part of modern JavaScript. They create a large barrier for new-to-JS devs, and are a recurring pain to set up and use regardless of experience level. They break randomly for opaque reasons, which are difficult to diagnose and fix. Even when they do work, they're slow.

They've also been increasingly unnecessary for years, but it can feel like we're still stuck with a ["complexity stockholm syndrome"](https://www.pika.dev/blog/pika-web-a-future-without-webpack).

If we want the vast majority of WP developers to build rich JS applications, then we need to [make it as simple as possible to get started](https://iandunn.name/2019/12/26/the-simplest-way-to-build-a-gutenberg-block/). Most folks don't work at Automattic/10up/etc, and don't have the privilege of spending hundreds of hours learning over-engineered abstractions and lengthy toolchains _on top of ES6 and React_, just to build a simple plugin. WordPress got to 40% of the Web in large part because it was easy for hobbyists and tinkerers to hack on their sites with very little knowledge, and then [grow over time](https://www.gatsbyjs.com/docs/conceptual/gatsby-core-philosophy/#progressively-disclose-complexity) into professional developers.

Right now there's a big wall between most folks and building what they want, in the ways that we want them to build it. If we don't make it simple, the closest that most devs _(and their users)_ will ever get to the promise of Gutenberg is [blocks built in PHP](https://www.advancedcustomfields.com/resources/blocks/).

That's not a criticism of ACF, they've done a great thing by making it simple. But if we want folks to build seamless dynamic interfaces, then we have to internalize the importance of simplicity again. Until we re-learn that lesson, we won't be able to make modern JS development in WordPress something that's accessible to everyone.


### Help Wanted

Right now this is just a proof-of-concept. Fork it and play around with it, see if it's useful in some real-world projects, etc. Give feedback by [reporting bugs & feature requests](https://github.com/iandunn/no-build-tools-no-problems/issues), and [starting discussions](https://github.com/iandunn/no-build-tools-no-problems/discussions). What kinds of problems or limitations do you run into? What's needed to make this live up to the vision?

If we can get this approach working well for a range of small/medium-sized plugins, then we can make a proposal for Core to support it, so that everything in `core/` will be provided to plugins automatically.


### Additional Resources & Inspiration

This paradigm is often referred to as "buildless" or "unbundled development".

* _Don't Build That App!_ by Luke Jackson [ [article](https://formidable.com/blog/2019/no-build-step/) | [presentation](https://www.youtube.com/watch?v=mVjZQrsXBQE) ].
* [A Future Without Webpack](https://www.pika.dev/blog/pika-web-a-future-without-webpack) by Pika.
* _[Developing Without a Build](https://dev.to/open-wc/developing-without-a-build-1-introduction-26ao)_ by Lars den Bakker.
* _["...but at what cost?"](https://github.com/lukejacksonn/perflink/issues/15#issuecomment-480509410)_ by Luke Jackson
* _[How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f)_ by Jose Aguinaga, which is [still relevant in 2021](https://lea.verou.me/2020/05/todays-javascript-from-an-outsiders-perspective/).
