import { sendRequest } from '@/utils.ts';
import type { Notification } from '@/notifications.tsx';

export function createApiCall(
	action: string,
	method: HttpMethod,
	onSuccess?: () => any,
	options?: ApiCallerOptions
) {
	return async () => {
		const result = await sendRequest<boolean>(action, method, options);
		if (result.wasSuccessful && onSuccess) onSuccess();
	}
}

export function appendSearchParams(baseUrl: string, query: object|undefined|null) {
	if (!query) return baseUrl;

	const params = new URLSearchParams();

	for (let [k, v] of Object.entries(query)) {
		if (v && Array.isArray(v)) {
			for (let item of v) {
				params.append(k, item);
			}
		} else {
			params.append(k, v);
		}
	}

	const queryString = params.toString();
	return !!queryString
		? `${baseUrl}?${queryString}`
		: baseUrl;
}

export type ApiCallerOptions = {
	body?: BodyInit
	requestOptions?: Omit<RequestInit, 'method'|'body'>
	onUnprocessable?: (error: ValidationErrorWebResult) => void
}

/**
 * Calls the Sienar REST API
 *
 * @param url The URL of the endpoint to call
 * @param method The HTTP method to use
 * @param options Additional configuration for the API call
 *
 * @returns The expected result if the call succeeded, else <code>null</code>
 */
export interface ApiCaller {
	<T>(url: string, method: HttpMethod, options?: ApiCallerOptions): Promise<T|null>
}

export type WebResult<T> = {
	result: T
	notifications: Notification[]
}

export type ValidationErrorWebResult = {
	title: string,
	status: number,
	traceId: string,
	errors: Record<string, string[]>
}

export type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS'|'TRACE'|'CONNECT';