import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const external = [
	'react',
	'react/jsx-runtime',
	'react-dom',
	'react-router',
	'react-router-dom'
];

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: {
				'index': './src/index.ts'
			},
			formats: [ 'es' ]
		},
		rollupOptions: { external }
	},
	optimizeDeps: {
		exclude: external
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
	},
	define: {
		'process.env.NODE_ENV': '"production"'
	}
});
