// AI Language Model connection helper based on working ChainLLM pattern

import type { BaseLanguageModel } from '@langchain/core/language_models/base';
import { type IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

/**
 * Simple assertion function to replace node:assert
 */
function assert(condition: any, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

/**
 * Gets the connected AI language model from the node inputs
 * Based on the successful ChainLLM implementation
 */
export async function getConnectedLanguageModel(
	ctx: IExecuteFunctions,
	itemIndex: number = 0,
): Promise<BaseLanguageModel | null> {
	try {
		// Use the same pattern as ChainLLM - this works!
		const connectedModel = await ctx.getInputConnectionData('ai_languageModel' as any, 0);

		if (!connectedModel) {
			return null;
		}

		// Validate that it's a language model
		if (typeof connectedModel === 'object' && 'invoke' in connectedModel) {
			return connectedModel as BaseLanguageModel;
		}

		return null;
	} catch (error) {
		// If there's an error getting the AI model, return null for fallback
		return null;
	}
}

/**
 * Validates that a language model is connected and throws error if not
 * Following ChainLLM pattern
 */
export function assertLanguageModelConnected(model: BaseLanguageModel | null): asserts model is BaseLanguageModel {
	assert(model, 'Please connect a language model to the Model input');
}

/**
 * Creates a simple prompt string from processed messages for the language model
 */
export function createPromptFromMessages(
	processedMessages: Array<{role: string, content: string}>
): string {
	let prompt = '';

	// Add each message with role prefix
	processedMessages.forEach(message => {
		switch(message.role) {
			case 'system':
				prompt += `System: ${message.content}\n\n`;
				break;
			case 'user':
				prompt += `Human: ${message.content}\n\n`;
				break;
			case 'assistant':
				prompt += `Assistant: ${message.content}\n\n`;
				break;
		}
	});

	// End with Assistant prompt to get response
	if (!prompt.trim().endsWith('Assistant:')) {
		prompt += 'Assistant:';
	}

	return prompt;
}/**
 * Executes the language model with the given prompt
 * Following ChainLLM pattern for model invocation
 */
export async function executeWithLanguageModel(
	model: BaseLanguageModel,
	prompt: string,
): Promise<string> {
	try {
		// Use invoke method like ChainLLM does
		const response = await model.invoke(prompt);

		// Handle different response formats
		if (typeof response === 'string') {
			return response;
		} else if (response && typeof response === 'object' && 'content' in response) {
			return String(response.content);
		} else {
			return String(response);
		}
	} catch (error) {
		throw new NodeOperationError(
			{} as any,
			`Error executing language model: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}
