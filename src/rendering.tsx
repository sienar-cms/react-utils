import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from '@/router.ts';
import { buildProviderTree, registerProvider } from '@/providers.tsx';
import { inject } from '@/di.ts';
import { NOTIFICATION_PROVIDER_COMPONENT } from '@/notifications.ts';

import type { ReactElement } from 'react';

export function useRerender(): [() => void, boolean] {
	const [trigger, setTrigger] = useState(false);
	return [() => setTrigger(!trigger), trigger];
}

export function createApp(rootId: string = 'root') {
	createRoot(document.getElementById(rootId)!)
		.render(buildProviderTree(createSienarRoot()));
}

function createSienarRoot(): ReactElement {
	const notificationProvider = inject(NOTIFICATION_PROVIDER_COMPONENT, true);
	if (notificationProvider) registerProvider(notificationProvider);

	return <RouterProvider router={ createRouter() }/>;
}