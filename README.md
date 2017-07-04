# Next.JS + Firebase + Redux + Styled Components

## Technologies

This project is a demonstration of several technologies working together:

1. NextJS: Included as a reasonable default for prototype React services. Handles build tooling, SSR, routing.
2. Firebase: I based this off of [the official Next Firebase example](https://github.com/zeit/next.js/tree/v3-beta/examples/with-firebase) originally, and most of `server.js` is the same as that source.
3. Redux + Thunks: Redux for state management, thunks for managing Firebase side-effects.
4. Styled Components: Mostly because I've been interested in seeing how they play with SSR in NextJS.

## How to use

Set up Firebase:
- Create a project!
- Get your service account credentials and client credentials files (see source).
- Set your firebase database url in `server.js`.
- On the firebase Authentication console, select Google as your provider.

Install and run:

```bash
yarn install
yarn run dev
```
