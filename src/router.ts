import { createBrowserRouter } from 'react-router-dom';
import { inject } from '@/di.ts';

import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom';
import type { InjectionKey } from '@/di.ts';

const routes = new Map<(InjectionKey<InjectionKey<ReactNode>>|InjectionKey<ReactNode>), Route[]>();

export const ERROR_VIEW = Symbol() as InjectionKey<ReactNode>;

export function registerRoutes(layoutKey: InjectionKey<InjectionKey<ReactNode>>|InjectionKey<ReactNode>, ...items: Route[]): void {
	if (!routes.has(layoutKey)) {
		routes.set(layoutKey, []);
	}

	routes.get(layoutKey)!.push(...items);
}

export function createRouter() {
	const layoutRoutes: RouteObject[] = [];
	const mappedRoutes = new Map<ReactNode, Route[]>();
	const errorComponent = inject(ERROR_VIEW, true);

	for (let [layoutKey, childRoutes] of routes) {
		const injectedValue = inject(layoutKey);
		const layout = typeof injectedValue === 'symbol'
			? inject(injectedValue) as ReactNode
			: injectedValue as ReactNode;

		if (!mappedRoutes.has(layout)) {
			mappedRoutes.set(layout, []);
		}

		mappedRoutes
			.get(layout)!
			.push(...childRoutes);
	}

	for (let [layout, childRoutes] of mappedRoutes) {
		layoutRoutes.push({
			path: '',
			element: layout,
			errorElement: errorComponent,
			children: convertSienarRoutesToReactRoutes(childRoutes)
		});
	}

	return createBrowserRouter(layoutRoutes);
}

export function convertSienarRoutesToReactRoutes(sienarRoutes: Route[]): RouteObject[] {
	const reactRouterRoutes: RouteObject[] = [];

	for (let route of sienarRoutes) {
		const reactRouterRoute: RouteObject = {
			path: typeof route.path === 'string' ? route.path : inject(route.path),
			element: typeof route.element === 'symbol' ? inject(route.element) : route.element,
			children: route.children ? convertSienarRoutesToReactRoutes(route.children) : undefined
		}
		reactRouterRoutes.push(reactRouterRoute);
	}

	return reactRouterRoutes;
}

export type Route = {
	path: string|InjectionKey<string>
	element: ReactNode|InjectionKey<ReactNode>
	children?: Route[]
}