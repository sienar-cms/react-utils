import { createContext, useContext } from 'react';
import type { InjectionKey } from '@/di.ts';
import type { ReactNode } from 'react';

export const AUTH_MUST_BE_LOGGED_OUT_PARTIAL = Symbol() as InjectionKey<ReactNode>;
export const AUTH_MISSING_ROLES_PARTIAL = Symbol() as InjectionKey<ReactNode>;
export const AUTH_MUST_BE_LOGGED_IN_PARTIAL = Symbol() as InjectionKey<ReactNode>;

export const authContext = createContext<AuthContext>({
	isLoggedIn: false,
	username: null,
	roles: [],
	login: () => {},
	logout: () => {},
	loadUserData: async () => {}
});

export const useAuthContext = () => useContext(authContext);

/**
 * Determines whether the user is authorized according to the supplied auth criteria
 *
 * If <code>authRoles</code> is falsy, it checks if the user is logged in. If <code>authRoles</code> is a string, it checks if the user is in any role matching the value of that string. If <code>authRoles</code> is an array, it checks if the user matches the roles in that array.
 *
 * If <code>any</code> is <code>true</code>, the user must satisfy any number of roles in the <code>authRoles</code> array. If <code>any</code> is false, the user must satisfy all roles in the <code>authRoles</code> array. If <code>authRoles</code> is not an array, the <code>any<code> parameter does nothing.
 *
 * @param authRoles The role(s) a user should have in order to be authorized
 * @param any Whether the user should match any or all roles
 */
export function useAuthorized(
	authRoles: string|string[]|null = null,
	any: boolean = false
): boolean {
	const authContext = useAuthContext();
	const { isLoggedIn, roles: userRoles } = authContext;

	if (!authRoles) return isLoggedIn;

	if (!isLoggedIn) return false;

	if (typeof authRoles === 'string') return userRoles.includes(authRoles);

	if (Array.isArray(authRoles)) {
		for (let r of authRoles) {
			const found = userRoles.includes(r);

			// If we found the role and any role will do, the user is authorized
			if (found && any) return true;

			// If we didn't find the role and all props are required, the user isn't authorized
			else if (!found && !any) return false;
		}

		// If we got here, either no roles were found when any role will do,
		// or all roles were found when all roles were required
		// so the result is the opposite of whether the any prop is set
		return !any;
	}

	// Shouldn't ever get here...famous last words
	// This might happen if, for example, a developer is not using Typescript
	// and passes a non-string, non-array value to authRoles
	return false;
}

/**
 * The current user's auth state in the app store
 */
export type AuthContext = {
	/**
	 * Whether the current user is logged in
	 */
	isLoggedIn: boolean

	/**
	 * The username of the current user, if any
	 */
	username: string|null

	/**
	 * The roles of the current user, if any
	 */
	roles: string[]

	/**
	 * Informs the UI that the user has been logged in
	 */
	login(data: LoginPayload): void

	/**
	 * Informs the UI that the user has been logged out
	 */
	logout(): void

	/**
	 * Loads the data of the currently logged in user from the server
	 */
	loadUserData(): Promise<void>
};

/**
 * The payload describing to the data store what user is logging in and what roles they have
 */
export type LoginPayload = {
	/**
	 * The username of the user currently logging in
	 */
	username: string

	/**
	 * The roles of the user currently logging in
	 */
	roles: readonly string[]
}