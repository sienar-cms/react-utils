import type { ReactElement, ReactNode, ComponentType, PropsWithChildren } from 'react';

const registry: ComponentType<PropsWithChildren>[] = [];

/**
 * Registers a provider that wraps around the root React application
 *
 * @param provider The provider to register
 */
export function registerProvider(provider: ComponentType<PropsWithChildren>) {
	// Providers should be added backwards to ensure that <StrictMode> is always the root
	registry.unshift(provider);
}

/**
 * Builds the provider tree to wrap around the root React application
 *
 * @param rootContent The root React application to render inside the provider tree
 */
export function buildProviderTree(rootContent: ReactElement): ReactNode {
	let providerTree: ReactNode|undefined = undefined;

	registry.forEach(Component => {
		const children = providerTree === undefined
			? rootContent
			: providerTree;
		providerTree = <Component children={children}/>
	})

	return providerTree;
}