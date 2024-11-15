import { inject } from '@/di.ts';
import { NOTIFIER } from '@/notifications.ts';
import type { ApiCallerOptions, HttpMethod, ValidationErrorWebResult, WebResult } from '@/http.ts';

export type RequestResult<T> = {
	wasSuccessful: boolean,
	result: T|null
}

export async function sendRequest<T>(
	url: string,
	method: HttpMethod,
	args: ApiCallerOptions = {}
): Promise<RequestResult<T>> {
	const {
		body,
		requestOptions,
		onUnprocessable
	} = args;

	const init: RequestInit = Object.assign({ method, body }, requestOptions);

	const safeMethods: HttpMethod[] = ['GET', 'HEAD', 'OPTIONS', 'CONNECT'];
	let shouldRefreshToken = false;

	if (!safeMethods.includes(method)) {
		shouldRefreshToken = true;
		init.headers = Object.assign({
			'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
		}, init.headers);
	}

	const request = new Request(url, init);
	const requestResult: RequestResult<T> = {
		wasSuccessful: false,
		result: null
	};

	const notifier = inject(NOTIFIER);
	let response: Response;

	try {
		response = await fetch(request);
	} catch(e) {
		notifier.error('A network error has occured. Are you connected to the internet?');

		return requestResult;
	}

	let result: WebResult<T>;
	try {
		if (response.status === 422) {
			const result = await response.json() as Record<string, any>;

			// In this case, the result is a WebResult containing notifications about invalid fields
			if (result['notifications'] && Array.isArray(result['notifications'])) {
				for (let n of (result as WebResult<T>).notifications) notifier.notify(n);
				return requestResult;
			}

			// Otherwise, the result is a ValidationErrorWebResult
			if (!onUnprocessable) return requestResult;

			onUnprocessable(result as ValidationErrorWebResult);
			return requestResult;
		}

		// The status can be 500 and still return a WebResult<T>
		result = await response.json() as WebResult<T>;
	} catch {
		// However, if the status is 500 and the response is blank,
		// response.json() will throw
		notifier.error('An unknown error has occurred.');

		return requestResult;
	}

	if (result.notifications && Array.isArray(result.notifications)) {
		for (let n of result.notifications) notifier.notify(n);
	}

	requestResult.wasSuccessful = response.ok;
	requestResult.result = result.result;

	if (shouldRefreshToken) {
		try {
			await fetch('/api/csrf');
		} catch {}
	}

	return requestResult;
}

/**
 * Simulates waiting for a specified amount of time. Probably only useful during development.
 *
 * @param time The amount of time to "sleep", in milliseconds
 */
export function sleep(time: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Converts a GMT date from the server into a local date string
 *
 * @param date The GMT date from the server
 * @param removeAt Whether to remove the ' at' separating the date and the time in the date string
 * @returns The parsed date if the date is valid, else <code>null</code>
 */
export function getDateString(
	date: string|null|undefined,
	removeAt: boolean = true
): string|null {
	if (!date) return null;

	const parsed = new Date(`${date}Z`);
	if (isNaN(parsed.getTime())) return null;
	const parsedString = parsed.toLocaleString('en-US', {
		timeZoneName: 'short',
		hour12: true,
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});

	return removeAt
		? parsedString.replace(' at', '')
		: parsedString;
}

export function getCookie(name: string): string|undefined {
	const cookies = document.cookie.split(';');

	for (let cookie of cookies) {
		const parts = cookie.split('=');
		const cookieName = parts.shift()!.trim();
		if (cookieName === name) {
			return parts.join('=').trim();
		}
	}
	return undefined;
}