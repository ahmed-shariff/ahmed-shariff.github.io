# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building
To create a production version of your app:

```bash
npm run build
```

- To deploy on github (uses [gh-pages](https://github.com/tschaub/gh-pages) (See [react-gh-pages](https://github.com/gitname/react-gh-pages) for more information)):
```bash
npm run deploy
```
This will build export the project and deploy it in the gh-pages branch of the same repo.

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
