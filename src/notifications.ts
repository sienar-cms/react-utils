import type { InjectionKey } from '@/di.ts';
import type { ComponentType, PropsWithChildren } from 'react';

export const NOTIFICATION_PROVIDER_COMPONENT = Symbol() as InjectionKey<ComponentType<PropsWithChildren>>;
export const NOTIFIER = Symbol() as InjectionKey<Notifier>;

export type Notification = {
	message: string
	type: NotificationType
}

/**
 * Renders a notification in the UI
 *
 * @param message The message to render
 * @param type The type of the notification to render
 */
export interface Notifier {
	/**
	 * Renders a success notification
	 *
	 * @param message The message to render
	 */
	success(message: string): void

	/**
	 * Renders a warning notification
	 *
	 * @param message The message to render
	 */
	warning(message: string): void

	/**
	 * Renders an informational notification
	 *
	 * @param message The message to render
	 */
	info(message: string): void

	/**
	 * Renders an error notification
	 *
	 * @param message The message to render
	 */
	error(message: string): void

	/**
	 * Renders a warning notification
	 *
	 * @param message The message to render
	 * @param type The type of the notification
	 */
	notify(message: string, type: NotificationType): void

	/**
	 * Renders a warning notification
	 *
	 * @param notification The notification to render
	 */
	notify(notification: Notification): void
}

/**
 * Represents different types of notifications
 */
export enum NotificationType {
	/**
	 * A successful notification
	 */
	Success,

	/**
	 * A notification containing warning information
	 */
	Warning,

	/**
	 * A notification containing specific information
	 */
	Info,

	/**
	 * A notification indicating an error occurred
	 */
	Error
}