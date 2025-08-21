interface ValidationParams {
	userInput: string;
	systemMessages: Array<{ message: string; label?: string; active?: boolean }>;
	model: any;
}

interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

/**
 * Validates all inputs before agent execution
 */
export async function validateInputs({
	userInput,
	systemMessages,
	model,
}: ValidationParams): Promise<ValidationResult> {
	const errors: string[] = [];

	// Validate user input
	if (!userInput || typeof userInput !== 'string') {
		errors.push('User input is required and must be a string');
	} else if (userInput.trim().length === 0) {
		errors.push('User input cannot be empty');
	} else if (userInput.length > 50000) {
		errors.push('User input is too long (max 50,000 characters)');
	}

	// Validate system messages
	if (!Array.isArray(systemMessages)) {
		errors.push('System messages must be an array');
	} else {
		const activeMessages = systemMessages.filter(msg => msg.active !== false);

		if (activeMessages.length === 0) {
			// This is just a warning, we'll provide a default message
			// console.warn('No active system messages found, using default message');
		}

		// Validate each system message
		systemMessages.forEach((message, index) => {
			if (!message.message || typeof message.message !== 'string') {
				errors.push(`System message at index ${index} must have a valid message string`);
			} else if (message.message.trim().length === 0 && message.active !== false) {
				errors.push(`Active system message at index ${index} cannot be empty`);
			} else if (message.message.length > 10000) {
				errors.push(`System message at index ${index} is too long (max 10,000 characters)`);
			}
		});
	}

	// Validate model
	if (!model) {
		errors.push('Language model is required');
	} else if (typeof model !== 'object') {
		errors.push('Language model must be a valid model object');
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Validates node configuration at startup
 */
export function validateNodeConfiguration(nodeParameters: any): ValidationResult {
	const errors: string[] = [];

	// Validate options
	if (nodeParameters.options) {
		const options = nodeParameters.options;

		if (options.maxIterations && (typeof options.maxIterations !== 'number' || options.maxIterations < 1 || options.maxIterations > 50)) {
			errors.push('Max iterations must be a number between 1 and 50');
		}


		if (options.timeout && (typeof options.timeout !== 'number' || options.timeout < 10 || options.timeout > 300)) {
			errors.push('Timeout must be a number between 10 and 300 seconds');
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
