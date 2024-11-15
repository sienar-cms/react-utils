import { useState } from 'react';
import { infrastructureContext } from '@/infrastructure.ts';
import { DASHBOARD_MENU, DASHBOARD_UTILS_MENU } from '@/menus.ts';

import type { PropsWithChildren } from 'react';
import type { InjectionKey } from '@/di.ts';
import type { MenuLinkProvider } from '@/menus.ts';

export default function InfrastructureProvider({ children }: PropsWithChildren) {
	const [ activeMenu, setActiveMenu ] = useState<InjectionKey<MenuLinkProvider>>(DASHBOARD_MENU);
	const [ activeUtilsMenu, setActiveUtilsMenu ] = useState<InjectionKey<MenuLinkProvider>>(DASHBOARD_UTILS_MENU);

	return (
		<infrastructureContext.Provider value={{
			activeMenu,
			setActiveMenu,
			activeUtilsMenu,
			setActiveUtilsMenu
		}}>
			{children}
		</infrastructureContext.Provider>
	);
}