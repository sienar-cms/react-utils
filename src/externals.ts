export const viteExternals = [
	'react',
	'react/jsx-runtime',
	'react-dom',
	'react-router',
	'react-router-dom'
];

export const viteOutputReplacementPaths = {
	'react': 'https://esm.sh/react@18.3.1',
	'react/jsx-runtime': 'https://esm.sh/react@18.3.1/jsx-runtime',
	'react-dom': 'https://esm.sh/react-dom@18.3.1',
	'react-router': 'https://esm.sh/react-router@6.26.2',
	'react-router-dom': 'https://esm.sh/react-router-dom@6.26.2'
}