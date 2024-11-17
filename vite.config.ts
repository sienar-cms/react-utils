import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { viteExternals } from './src/externals.ts';

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
			external: viteExternals
		}
	},
	optimizeDeps: {
		exclude: viteExternals
	},
	plugins: [
		react(),
		dts({
			rollupTypes: true,
			tsconfigPath: './tsconfig.app.json'
		})
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@components': resolve(__dirname, './src/components')
		}
	}
});
