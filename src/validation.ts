import { createContext, useContext, useEffect, useState } from 'react';

export const formValidationContext = createContext<FormContext>({
	hasInteracted: false,
	fields: {}
});

/**
 * Uses form fields with automatic validation
 *
 * @param inputName The value of the HTML <code>name</code> attribute
 * @param displayName The human-friendly display name, if any
 * @param value The current value of the form field
 * @param setValue A function to set the current value of the form field
 * @param validators An array of validator functions
 *
 * @returns An array containing the current validation results as the first value and a function informing the form context that an interaction has occurred as the second value
 */
export function useFormFieldValidation<T extends unknown>(
	inputName: string,
	displayName: string|null|undefined,
	value: T,
	setValue: (newValue: T) => any,
	validators: FormValueValidator<T>[]
): [
	ValidationResult[],
	() => void
] {
	const [ validationResults, setValidationResults ] = useState<ValidationResult[]>([]);
	const formContext = useContext(formValidationContext);

	const validate: FormFieldValidator = () => {
		if (!formContext.hasInteracted) {
			return false;
		}

		// If the displayName is not set, the developer should manage validation
		if (!displayName) return true;

		// @ts-ignore
		const internalResults: ValidationResult[] = [];
		let hasErrors = false;

		for (let validator of validators) {
			const valid = validator.isValid(
				value,
				formContext.fields
			);
			internalResults.push({
				valid,
				message: formatValidationMessage(validator, inputName, formContext.fields)
			});

			if (!valid) {
				hasErrors = true;
			}
		}

		setValidationResults(internalResults);
		return !hasErrors;
	}

	/**
	 * The validate function is recreated on each render
	 */
	useEffect(() => {
		formContext.fields[inputName] = {
			displayName,
			validator: validate,
			value,
			setValue,
			validationResults,
			setValidationResults
		}

		// If there is no displayName, validation may not work
		if (displayName) validate();

		// Clean up the context because React caches this stuff
		return () => {
			delete formContext.fields[inputName];
		};
	}, [value]);

	return [validationResults, () => formContext.hasInteracted = true];
}

export function formatValidationMessage(
	validator: FormValueValidator<any>,
	name: string,
	formValues: Record<string, FormField>): string {
	let message = validator.message;
	const replacements = Object.assign(
		{
			'name': formValues[name].displayName ?? name,
			'value': formValues[name].value
		},
		validator.replacementValues
	);

	for (let key in replacements) {
		const regex = new RegExp(`\%${key}`, 'g');
		if (typeof replacements[key] === 'function') {
			message = message.replace(regex, replacements[key](formValues))
		} else {
			message = message.replace(regex, replacements[key] as string);
		}
	}

	return message;
}

/**
 * A function that validates the state of a form field
 */
export type FormFieldValidator = {
	(): boolean
};

/**
 * A validation result for form field validation
 */
export type ValidationResult = {
	/**
	 * Whether the form field value is valid
	 */
	valid: boolean|null

	/**
	 * The validation message to show the user
	 */
	message: string
}

/**
 * Represents a form field in the FormContext
 */
export type FormField = {
	/**
	 * The display name of the form field, used for error validation purposes
	 */
	displayName: string|undefined|null

	/**
	 * The function that validates the value of a form field
	 */
	validator: FormFieldValidator

	/**
	 * The current value of the form field
	 */
	value: any

	/**
	 * The React state setter for the form field
	 *
	 * @param newValue The new value to set
	 */
	setValue: (newValue: any) => void

	/**
	 * An array of validation results
	 */
	validationResults: ValidationResult[],

	/**
	 * The React state setter for the validation results
	 *
	 * @param newValue The new validation results to set
	 */
	setValidationResults: (newValue: ValidationResult[]) => void
}

/**
 * The context shared by all inputs in a form
 */
export type FormContext = {
	/**
	 * Whether the form has been interacted with
	 */
	hasInteracted: boolean

	/**
	 * A record of all fields in the form
	 */
	fields: Record<string, FormField>
}

/**
 * An object representing a form value validation rule
 */
export type FormValueValidator<T> = {
	/**
	 * The message to use to identify the validator in the form validation result area
	 */
	message: string

	/**
	 * A function used to determine whether the value passes validation. Returns <code>true</code> if the value is valid
	 *
	 * @param input The value to validate
	 */
	isValid: (input: T|null, formFields: Record<string, FormField>) => boolean|null

	/**
	 * An object of key-value replacement values to use when formatting the validation message
	 */
	replacementValues?: Record<string, ((values: Record<string, FormField>) => string)|string|number>
}