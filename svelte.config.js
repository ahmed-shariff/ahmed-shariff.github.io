import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
	adapter: adapter({
	    pages: 'build',
	    assets: 'build',
	    fallback: '404.html',
	    precompress: false,
	    strict: true
	}),
	paths: {
	    base: process.argv.includes('dev') ? '' : "https://shariff-faleel.com"
	},
	alias: {
	    posts: "src/posts"
	}
    },
    extensions: ['.svelte', '.md'],
    preprocess: [
	vitePreprocess(),
	mdsvex({
	    extensions: ['.md'],
	    remarkPlugins: [
		remarkGfm,
	    ]
	})
    ]
};

export default config;
