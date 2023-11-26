import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

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
	}
    },
    preprocess: vitePreprocess()
};

export default config;
