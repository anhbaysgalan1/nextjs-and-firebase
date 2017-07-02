# Next.JS + Firebase

This is a refactor/reorganization of [the official Next Firebase example](https://github.com/zeit/next.js/tree/v3-beta/examples/with-firebase). I made this mainly to play around with Firebase, and get a feel for how it would interact with Next.

## How to use

Set up firebase:
- create a project
- get your service account credentials and client credentials files (see source).
- set your firebase database url in server.js
- on the firebase Authentication console, select Google as your provider

Install it and run:

```bash
yarn install
yarn run dev
```

## Observations

- This would work best if you forgo client-side routing, since determining user relies on `req`. You could still navigate, but there'd be a FOUC once Firebase reinitialized.
- One of Next's weaknesses is a lack of global setup code on the client-side. There's `_document.js`, but it's completely server-rendered, so you can't tap into lifecycle events.
	- On other projects I observed this as a limitation if you wanted to, say, fire some client code to track pageviews everywhere.
	- With Firebase, you have no place to set up the client except in the pages, so you'd be forced to teardown/reinit if you *were* using client-side routing.
	- This is, likely, by design; shared state between pages might be considered an antipattern, since it would be disjointed from the server-rendered equivalents.
