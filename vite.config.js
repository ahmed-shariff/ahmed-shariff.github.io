import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
	sveltekit(),
	tailwindcss()
    ],
    server: {
        fs: {
            // Allow Vite to serve files from the symlinked directories
            allow: [
                // Search up to find the project root
                './',
                // Alternatively, explicitly resolve the real path if needed:
                /* path.resolve(__dirname, '..') */
            ]
        }
    }
});
