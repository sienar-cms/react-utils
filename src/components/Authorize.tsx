import { useAuthorized } from '@/auth.ts';
import type { PropsWithChildren, ReactNode } from 'react';

/**
 * Describes the props of the <code>&lt;Authorize.Content&gt;</code> component
 */
export type AuthorizeProps = {
	/**
	 * The roles the user must meet. If <code>null</code>, the user only needs to be logged in.
	 */
	roles?: string|string[]|null

	/**
	 * Whether the user will be authorized if they only meet a single role in the <code>roles</code> array. Ignored if <code>roles</code> is not an array.
	 */
	any?: boolean

	/**
	 * Fallback content to render if the user is not authorized
	 */
	unauthorized?: ReactNode
}

/**
 * Renders content if the user meets the provided authorization criteria. If the user does not, fallback content can be specified.
 */
export default function Authorize(props: PropsWithChildren<AuthorizeProps>) {
	const { roles, any = false, unauthorized, children } = props;
	const isAuthorized = useAuthorized(roles, any);
	return isAuthorized ? <>{children}</> : <>{unauthorized}</>;
}