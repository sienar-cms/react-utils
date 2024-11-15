import { AUTH_MISSING_ROLES_PARTIAL, AUTH_MUST_BE_LOGGED_IN_PARTIAL, AUTH_MUST_BE_LOGGED_OUT_PARTIAL, useAuthorized, useAuthContext } from '@/auth.ts';
import { inject } from '@/di.ts';
import type { AuthorizeProps } from '@/components/Authorize.tsx';
import type { InjectionKey } from '@/di.ts';
import type { PropsWithChildren, ReactNode } from 'react';

export type AuthorizeRouteProps = Pick<AuthorizeProps, 'any'|'roles'> & {
	mustBeLoggedOut?: boolean
	missingRolesKey?: InjectionKey<ReactNode>
	mustBeLoggedInKey?: InjectionKey<ReactNode>
	mustBeLoggedOutKey?: InjectionKey<ReactNode>
}

export default function AuthorizeRoute(props: PropsWithChildren<AuthorizeRouteProps>) {
	const {
		roles,
		any,
		mustBeLoggedOut,
		children,
		missingRolesKey = AUTH_MISSING_ROLES_PARTIAL,
		mustBeLoggedInKey = AUTH_MUST_BE_LOGGED_IN_PARTIAL,
		mustBeLoggedOutKey = AUTH_MUST_BE_LOGGED_OUT_PARTIAL
	} = props;

	const authContext = useAuthContext();
	const { isLoggedIn } = authContext;
	const isAuthorizedToApp = useAuthorized(roles, any);
	const isAuthorizedToViewPage = mustBeLoggedOut ? !isLoggedIn : isAuthorizedToApp;

	let content: ReactNode;

	switch (true) {
		case isAuthorizedToViewPage:
			content = children;
			break;
		case mustBeLoggedOut:
			content = inject(mustBeLoggedOutKey);
			break;
		case isLoggedIn:
			content = inject(missingRolesKey);
			break;
		default:
			content = inject(mustBeLoggedInKey);
			break;
	}

	return <>{content}</>;
}