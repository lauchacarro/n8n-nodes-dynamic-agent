// AI execution with tools support for CustomAgent
// Handles both simple chat (no tools) and agent mode (with tools)

import type { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import type { DynamicStructuredTool, Tool } from 'langchain/tools';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';

interface ProcessedMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

/**
 * Executes AI model with optional tools support
 * @param languageModel The connected AI model
 * @param messages Array of processed messages
 * @param tools Array of connected tools (empty = simple chat mode)
 * @param options Execution options
 * @returns AI response as string
 */
export async function executeWithLanguageModelAndTools(
	languageModel: BaseLanguageModel,
	messages: ProcessedMessage[],
	tools: Array<DynamicStructuredTool | Tool>,
	options: {
		maxIterations?: number;
		returnIntermediateSteps?: boolean;
	} = {}
): Promise<string> {
	// Case 1: No tools connected - Simple chat mode
	if (!tools || tools.length === 0) {
		console.log('🤖 Running in simple chat mode (no tools)');

		// Use the same pattern as ai-connections.ts for simple execution
		const promptContent = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
		const result = await languageModel.invoke(promptContent);

		return String(result.content || 'No response generated');
	}

	// Case 2: Tools connected - Agent mode with tool calling
	console.log(`🛠️ Running in agent mode with ${tools.length} tool(s): ${tools.map(t => t.name).join(', ')}`);

	try {
		// Create prompt template using the LangChain pattern
		const promptMessages = messages.map(msg => {
			switch (msg.role) {
				case 'system':
					return ['system', msg.content] as [string, string];
				case 'user':
					return ['human', msg.content] as [string, string];
				case 'assistant':
					return ['assistant', msg.content] as [string, string];
				default:
					return ['human', msg.content] as [string, string];
			}
		});

		// Add agent scratchpad for tool usage
		promptMessages.push(['placeholder', '{agent_scratchpad}'] as [string, string]);

		const prompt = ChatPromptTemplate.fromMessages(promptMessages);

		// Create tool-calling agent
		const agent = createToolCallingAgent({
			llm: languageModel,
			tools,
			prompt,
			streamRunnable: false,
		});

		// Create agent executor
		const executor = AgentExecutor.fromAgentAndTools({
			agent,
			tools,
			maxIterations: options.maxIterations || 10,
			returnIntermediateSteps: options.returnIntermediateSteps || false,
		});

		// Get the last user message as input
		const lastUserMessage = messages
			.filter(msg => msg.role === 'user')
			.pop();

		const input = lastUserMessage?.content || 'Please help me';

		// Execute the agent
		const result = await executor.invoke({
			input,
		});

		return result.output || 'No response generated';

	} catch (error) {
		console.error('Error in agent execution:', error);

		// Fallback to simple mode if agent fails
		console.log('🔄 Falling back to simple chat mode due to error');

		const promptContent = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
		const result = await languageModel.invoke(promptContent);

		return String(result.content) || 'Error occurred during execution';
	}
}

/**
 * Validates that the language model supports tool calling
 */
export function validateModelForTools(
	languageModel: BaseLanguageModel,
	tools: Array<DynamicStructuredTool | Tool>
): boolean {
	if (tools.length === 0) {
		return true; // No tools, no validation needed
	}

	// Check if model supports tool calling
	if (!('bindTools' in languageModel) || typeof languageModel.bindTools !== 'function') {
		console.warn('⚠️ Connected language model does not support tool calling');
		return false;
	}

	return true;
}
