// This DI container is loosely inspired by VueJS' <code>provide</code>/<code>inject</code> functionality. For the most part, I just borrowed the *idea* to create this (much simpler) DI container; however, the function names are the same (why waste a good function name?), and the interface <code>InjectionConstraint<T></code> and type <code>InjectionKey<T></code> are directly copied from the VueJS Inject API at https://github.com/vuejs/core/blob/v3.5.12/packages/runtime-core/src/apiInject.ts#L7-L9. The purpose of the copying was to facilitate explicit typing of injected values when using Typescript. The rest of this DI container is custom code that works fundamentally differently from the VueJS Inject API. VueJS is released under the MIT License.

// @ts-ignore: The type in InjectionConstraint is unused, but it is required to be here because it is used when explicitly typing values returned using the <code>inject</code> function below.
interface InjectionConstraint<T> {}
export type InjectionKey<T> = symbol & InjectionConstraint<T>;

const di: Record<InjectionKey<any>, any> = {};

/**
 * Registers a value in the Sienar DI container
 *
 * @param key The unique key that identifies the value in the container
 * @param value The value to register
 * @param override Whether to override an existing value if one is already registered
 */
export function provide<T>(
	key: InjectionKey<T>,
	value: T,
	override: boolean = true
) {
	if (override) di[key] = value;
	else di[key] ??= value;
}

/**
 * Injects a required value from the Sienar DI container
 *
 * @param key The unique key that identifies the value in the container
 * @param optional Whether to fail if the value is not found
 * @returns The value if it exists
 */
export function inject<T>(key: InjectionKey<T>, optional?: false): T;

/**
 * Injects an optional value from the Sienar DI container
 *
 * @param key The unique key that identifies the value in the container
 * @param optional Whether to fail if the value is not found
 * @returns The value
 *
 * @throws Error If no value is registered with the given key
 */
export function inject<T>(key: InjectionKey<T>, optional: true): T|undefined;

export function inject<T>(key: InjectionKey<T>, optional: boolean = false): T {
	const value = di[key];
	if (typeof value === 'undefined' && !optional) throw new Error('Unable to locate value with the provided key');

	return value;
}