import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions.ts';
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 8080,
		host: '0.0.0.0',
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, 'src')
		}
	},
	build: {
		outDir: '../erpnext/public/banking',
		emptyOutDir: true,
		target: 'es2015',
		rollupOptions: {
			// Frappe-served assets (e.g. Inter fonts in index.css) only
			// exist at runtime on the bench; declaring them external keeps
			// the URLs untouched and silences the expected
			// "didn't resolve at build time" notice.
			external: [/^\/assets\/frappe\//],
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) {
						return
					}
					if (id.includes('react-dom') || id.includes('/react/')) {
						return 'vendor-react'
					}
					if (id.includes('frappe-react-sdk')) {
						return 'vendor-frappe'
					}
					if (id.includes('@tanstack')) {
						return 'vendor-tanstack'
					}
					if (id.includes('fuse.js')) {
						return 'vendor-fuse'
					}
					if (id.includes('radix-ui') || id.includes('@radix-ui')) {
						return 'vendor-radix'
					}
					if (id.includes('jotai')) {
						return 'vendor-jotai'
					}
					if (id.includes('lucide-react')) {
						return 'vendor-lucide'
					}
				},
			},
		},
	},
});
