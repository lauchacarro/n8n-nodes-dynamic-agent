import JSON5 from 'json5';

interface DynamicMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface ProcessedMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

/**
 * Processes dynamic messages with different roles
 */
export async function processDynamicMessages(messages: DynamicMessage[]): Promise<ProcessedMessage[]> {
	if (!Array.isArray(messages)) {
		return [{ role: 'system', content: 'You are a helpful AI assistant. Respond clearly and concisely.' }];
	}

	// Filter messages and extract the message content
	const validMessages = messages
		.filter((msg) => msg.content && msg.content.trim().length > 0)
		.map((msg) => ({
			role: msg.role,
			content: msg.content.trim()
		}));

	// If no valid messages, provide a default system message
	if (validMessages.length === 0) {
		return [{ role: 'system', content: 'You are a helpful AI assistant. Respond clearly and concisely.' }];
	}

	return validMessages;
}

/**
 * Processes JSON array of messages
 */
export async function processJsonMessages(jsonString: string): Promise<ProcessedMessage[]> {
	try {
		const messages = JSON5.parse(jsonString);

		if (!Array.isArray(messages)) {
			throw new Error('JSON must be an array of messages');
		}

		// Validate and process each message
		const processedMessages: ProcessedMessage[] = [];

		for (let i = 0; i < messages.length; i++) {
			const msg = messages[i];

			if (!msg.role || !msg.content) {
				throw new Error(`Message at index ${i} must have 'role' and 'content' properties`);
			}

			if (!['system', 'user', 'assistant'].includes(msg.role)) {
				throw new Error(`Message at index ${i} has invalid role '${msg.role}'. Must be 'system', 'user', or 'assistant'`);
			}

			if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
				throw new Error(`Message at index ${i} must have non-empty content`);
			}

			processedMessages.push({
				role: msg.role,
				content: msg.content.trim()
			});
		}

		if (processedMessages.length === 0) {
			return [{ role: 'system', content: 'You are a helpful AI assistant. Respond clearly and concisely.' }];
		}

		return processedMessages;
	} catch (error) {
		throw new Error(`Invalid JSON messages: ${error.message}`);
	}
}

/**
 * Validates dynamic messages
 */
export function validateDynamicMessages(messages: DynamicMessage[]): string[] {
	const errors: string[] = [];

	if (!Array.isArray(messages)) {
		errors.push('Messages must be an array');
		return errors;
	}

	messages.forEach((message, index) => {
		if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
			errors.push(`Message at index ${index} must have a valid role (system, user, or assistant)`);
		}

		if (!message.content || typeof message.content !== 'string') {
			errors.push(`Message at index ${index} must have a valid content string`);
		}

		if (message.content && message.content.trim().length === 0) {
			errors.push(`Message at index ${index} cannot have empty content`);
		}

		if (message.content && message.content.length > 10000) {
			errors.push(`Message at index ${index} content is too long (max 10,000 characters)`);
		}
	});

	return errors;
}

/**
 * Validates JSON messages string
 */
export function validateJsonMessages(jsonString: string): string[] {
	const errors: string[] = [];

	if (!jsonString || typeof jsonString !== 'string') {
		errors.push('JSON messages must be a valid string');
		return errors;
	}

	try {
		const messages = JSON5.parse(jsonString);

		if (!Array.isArray(messages)) {
			errors.push('JSON must be an array of messages');
			return errors;
		}

		messages.forEach((message, index) => {
			if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
				errors.push(`Message at index ${index} must have a valid role (system, user, or assistant)`);
			}

			if (!message.content || typeof message.content !== 'string') {
				errors.push(`Message at index ${index} must have a valid content string`);
			}

			if (message.content && message.content.trim().length === 0) {
				errors.push(`Message at index ${index} cannot have empty content`);
			}

			if (message.content && message.content.length > 10000) {
				errors.push(`Message at index ${index} content is too long (max 10,000 characters)`);
			}
		});
	} catch (parseError) {
		errors.push(`Invalid JSON format: ${parseError.message}`);
	}

	return errors;
}

// Legacy support for old system messages format (for backward compatibility)
interface SystemMessage {
	message: string;
	label?: string;
	active?: boolean;
}

/**
 * Processes and validates system messages (legacy support)
 */
export async function processSystemMessages(messages: SystemMessage[]): Promise<string[]> {
	if (!Array.isArray(messages)) {
		return ['You are a helpful AI assistant. Respond clearly and concisely.'];
	}

	// Filter active messages and extract the message text
	const activeMessages = messages
		.filter((msg) => msg.active !== false && msg.message && msg.message.trim().length > 0)
		.map((msg) => msg.message.trim());

	// If no active messages, provide a default
	if (activeMessages.length === 0) {
		return ['You are a helpful AI assistant. Respond clearly and concisely.'];
	}

	return activeMessages;
}
