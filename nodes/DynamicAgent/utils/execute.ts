import type {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { processDynamicMessages, processYamlMessages } from './message-processor';
import {
	getConnectedLanguageModel,
} from './ai-connections';
import { getConnectedAgentTools } from './tools-handler';
import { executeWithLanguageModelAndTools } from './ai-tools-execution';/**
 * Main execution function for the Dynamic Agent
 */
export async function dynamicAgentExecute(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			// Get node parameters
			const messageMode = this.getNodeParameter('messageMode', itemIndex, 'individual') as string;

			let processedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

			if (messageMode === 'individual') {
				// Handle individual dynamic messages
				const dynamicMessages = this.getNodeParameter('dynamicMessages', itemIndex, {
					messages: [],
				}) as { messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string; label?: string; active?: boolean }> };

				processedMessages = await processDynamicMessages(dynamicMessages.messages);
			} else {
				// Handle YAML array messages
				const messagesYaml = this.getNodeParameter('messagesJson', itemIndex, '[]') as string;
				processedMessages = await processYamlMessages(messagesYaml);
			}



			// Validate that we have at least one message
			if (!processedMessages || processedMessages.length === 0) {
				throw new Error('At least one message is required. Please configure messages using Individual or JSON mode.');
			}

			// Get connected AI Language Model (following ChainLLM pattern)
			const languageModel = await getConnectedLanguageModel(this, itemIndex);

			// Validate that a language model is connected - REQUIRED
			if (!languageModel) {
				throw new NodeOperationError(
					this.getNode(),
					'Please connect a language model to the Model input. This node requires an AI model to function.',
					{ itemIndex }
				);
			}

			// Get connected tools (may be empty array)
			const connectedTools = await getConnectedAgentTools(this);

			// Execute with AI model - with or without tools support
			// Get tool execution options
			const toolOptions = this.getNodeParameter('options.toolOptions', itemIndex, {}) as {
				maxIterations?: number;
				returnIntermediateSteps?: boolean;
			};

			// Execute the language model with tools
			const executionResult = await executeWithLanguageModelAndTools(
				languageModel,
				processedMessages,
				connectedTools,
				{
					maxIterations: toolOptions.maxIterations || 10,
					returnIntermediateSteps: toolOptions.returnIntermediateSteps || false,
				}
			);

			// Simple response format: {output: "response"}
			returnData.push({
				json: {
					output: executionResult.response,
				},
				pairedItem: { item: itemIndex },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
						timestamp: new Date().toISOString(),
					},
					pairedItem: { item: itemIndex },
				});
			} else {
				throw new NodeOperationError(this.getNode(), error, { itemIndex });
			}
		}
	}

	return [returnData];
}
