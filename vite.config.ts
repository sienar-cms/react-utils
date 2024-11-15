import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteExternals, viteOutputReplacementPaths } from './src/externals.ts';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: {
				'sienar-react-utils': './src/index.ts'
			},
			formats: [ 'es' ]
		},
		rollupOptions: {
			external: viteExternals,
			output: {
				paths: viteOutputReplacementPaths
			}
		}
	},
	optimizeDeps: {
		exclude: viteExternals
	},
	plugins: [
		react()
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@components': resolve(__dirname, './src/components')
		}
	}
});
