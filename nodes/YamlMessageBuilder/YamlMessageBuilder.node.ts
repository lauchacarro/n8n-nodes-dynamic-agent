import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import * as YAML from 'yaml';

export class YamlMessageBuilder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YAML Message Builder',
		name: 'yamlMessageBuilder',
		icon: 'file:yamlbuilder4.svg',
		iconColor: 'orange',
		group: ['transform'],
		version: 1,
		description: 'Build perfectly formatted YAML message arrays for Dynamic AI Agent. No more indentation or special character issues!',
		defaults: {
			name: 'YAML Message Builder',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: '📝 YAML Message Builder generates perfect YAML arrays ready for Dynamic AI Agent. No more indentation headaches!',
				name: 'welcomeNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Message Role',
				name: 'messageRole',
				type: 'options',
				default: 'system',
				options: [
					{
						name: '🤖 System',
						value: 'system',
						description: 'System message that defines AI behavior and context',
					},
					{
						name: '👤 User',
						value: 'user',
						description: 'User message representing human input',
					},
					{
						name: '🎯 Assistant',
						value: 'assistant',
						description: 'Assistant message representing AI responses (for examples)',
					},
				],
				description: 'Select the role for this message',
			},
			{
				displayName: 'Message Content',
				name: 'messageContent',
				type: 'string',
				default: '',
				placeholder: 'Enter your message content here...\n\nYou can use:\n- Multiple lines\n- "Quotes" and \'apostrophes\'\n- `Backticks` and ```code blocks```\n- Any special characters without escaping!',
				typeOptions: {
					rows: 8,
				},
				required: true,
				description: 'The content of your message. Supports multiline text, quotes, and special characters without any escaping needed.',
			},
		],
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Utilities', 'Helpers'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://github.com/custom-agent/n8n-nodes-custom-agent',
					},
				],
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				// Get node parameters
				const messageRole = this.getNodeParameter('messageRole', itemIndex) as string;
				const messageContent = this.getNodeParameter('messageContent', itemIndex) as string;				// Validate inputs
				if (!messageContent || messageContent.trim().length === 0) {
					throw new NodeOperationError(this.getNode(), 'Message content is required and cannot be empty', { itemIndex });
				}

				if (!['system', 'user', 'assistant'].includes(messageRole)) {
					throw new NodeOperationError(this.getNode(), `Invalid role '${messageRole}'. Must be 'system', 'user', or 'assistant'`, { itemIndex });
				}

				// Build message object
				const messageObject = {
					role: messageRole,
					content: messageContent.trim()
				};

				// Generate YAML array format (ready for Dynamic AI Agent)
				const messagesArray = [messageObject];

				// Always use multi-line format with proper indentation for readability
				const yamlOutput = YAML.stringify(messagesArray, {
					indent: 2,
					lineWidth: 0,
					blockQuote: messageContent.includes('\n') ? 'literal' : undefined
				});

				// Ensure proper line ending
				const finalYamlOutput = yamlOutput.endsWith('\n') ? yamlOutput : yamlOutput + '\n';

				// Create output with metadata
				const outputData = {
					output: finalYamlOutput,
					meta: {
						role: messageRole,
						contentLength: messageContent.length,
						format: 'array',
						hasMultiline: messageContent.includes('\n'),
						generatedAt: new Date().toISOString()
					}
				};

				returnData.push({
					json: outputData,
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
					throw error;
				}
			}
		}

		return [returnData];
	}
}
