import { useEffect, useState } from 'react';
import { authContext } from '@/auth.ts';

import type { PropsWithChildren } from 'react';
import type { LoginPayload } from '@/auth.ts';
import type { WebResult } from '@/http.ts';

export default function AuthProvider({ children }: PropsWithChildren) {
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);
	const [ username, setUsername ] = useState('');
	const [ roles, setRoles ] = useState<string[]>([]);

	const login = (data: LoginPayload) => {
		setIsLoggedIn(true);
		setUsername(data.username);
		setRoles(data.roles as string[]);
	}

	const logout = () => {
		setIsLoggedIn(false);
		setUsername('');
		setRoles([]);
	}

	const loadUserData = async () => {
		const response = await fetch('/api/account');
		if (!response.ok) {
			logout();
			return;
		}

		const userDataResult = await response.json() as WebResult<LoginPayload>;
		if (!userDataResult.result) return;

		const userData = userDataResult.result;
		if (!userData.username || !Array.isArray(userData.roles)) {
			logout();
			return;
		}

		login(userData);
	}

	useEffect(() => {
		(async () => {
			try {
				await loadUserData();
			} catch (e) {
				console.error(e);
			}
		})();
	}, []);

	return (
		<authContext.Provider
			value={{
				isLoggedIn,
				username,
				roles,
				login,
				logout,
				loadUserData
			}}
		>
			{children}
		</authContext.Provider>
	);
}