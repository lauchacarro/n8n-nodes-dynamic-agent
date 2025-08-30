import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { dynamicAgentExecute } from './utils/execute';
import { getInputs } from './utils/node-inputs';

export class DynamicAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dynamic AI Agent',
		name: 'dynamicAgent',
		icon: 'fa:robot',
		iconColor: 'black',
		group: ['transform'],
		version: 1,
		description: 'Dynamic AI Agent with flexible message configuration, multi-role support and YAML compatibility',
		defaults: {
			name: 'Dynamic AI Agent',

		},
		inputs: getInputs(),
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Welcome to Dynamic AI Agent! This node provides enhanced flexibility with multi-role messages, YAML support, and seamless tool integration.',
				name: 'welcomeNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Message Configuration Mode',
				name: 'messageMode',
				type: 'options',
				default: 'individual',
				options: [
					{
						name: 'Individual Messages',
						value: 'individual',
						description: 'Configure messages one by one with full control over roles',
					},
					{
						name: 'YAML Array',
						value: 'json',
						description: 'Provide a complete YAML array of messages (supports multiline, quotes, and special characters)',
					},
				],
				description: 'Choose how you want to configure the messages',
			},
			{
				displayName: 'Messages',
				name: 'dynamicMessages',
				type: 'fixedCollection',
				default: {
					messages: [
						{
							role: 'system',
							content: 'You are a helpful AI assistant. Respond clearly and concisely.',
						},
					],
				},
				placeholder: 'Add Message',
				typeOptions: {
					multipleValues: true,
					sortable: true,
					multipleValueButtonText: 'Add Message',
				},
				displayOptions: {
					show: {
						messageMode: ['individual'],
					},
				},
				options: [
					{
						name: 'messages',
						displayName: 'Message',
						values: [
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								default: 'system',
								options: [
									{
										name: 'System',
										value: 'system',
										description: 'System message that defines AI behavior and context',
									},
									{
										name: 'User',
										value: 'user',
										description: 'User message representing human input',
									},
									{
										name: 'Assistant',
										value: 'assistant',
										description: 'Assistant message representing AI responses',
									},
								],
								description: 'The role of this message in the conversation',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								default: '',
								placeholder: 'Enter message content...',
								typeOptions: {
									rows: 4,
								},
								required: true,
								description: 'The content of the message',
							},
						],
					},
				],
				description: 'Configure individual messages with specific roles',
			},
			{
				displayName: 'Messages YAML Array',
				name: 'messagesJson',
				type: 'string',
				default: `- role: system
  content: "You are a helpful AI assistant."
- role: user
  content: "Hello!"
- role: assistant
  content: "Hello! How can I help you today?"`,
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						messageMode: ['json'],
					},
				},
				placeholder: `- role: system
  content: |
    System message with multiline support.

    You can use:
    - "Quotes" and 'apostrophes'
    - \`Backticks\` and code blocks
    - Any special characters!

- role: user
  content: "User message"

- role: assistant
  content: "Assistant response"`,
				description: 'Enter a YAML array of messages. Each message should have "role" and "content" properties. YAML supports multiline text, quotes, and special characters without escaping.',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				default: {},
				placeholder: 'Add Option',
				options: [
					{
						displayName: 'Enable Streaming',
						name: 'enableStreaming',
						type: 'boolean',
						default: true,
						description: 'Whether to enable streaming responses for real-time output',
					},
					{
						displayName: 'Max Iterations',
						name: 'maxIterations',
						type: 'number',
						default: 10,
						typeOptions: {
							minValue: 1,
							maxValue: 50,
						},
						description: 'Maximum number of iterations the agent will perform',
					},
					{
						displayName: 'Return Intermediate Steps',
						name: 'returnIntermediateSteps',
						type: 'boolean',
						default: false,
						description: 'Whether to include information about intermediate steps taken by the agent',
					},
					{
						displayName: 'Timeout (Seconds)',
						name: 'timeout',
						type: 'number',
						default: 60,
						typeOptions: {
							minValue: 10,
							maxValue: 300,
						},
						description: 'Maximum time to wait for agent response',
					},
					{
						displayName: 'Tool Execution Options',
						name: 'toolOptions',
						type: 'collection',
						default: {},
						placeholder: 'Add Tool Option',
						options: [
							{
								displayName: 'Max Tool Iterations',
								name: 'maxIterations',
								type: 'number',
								default: 10,
								typeOptions: {
									minValue: 1,
									maxValue: 50,
								},
								description: 'Maximum number of tool calls the agent can make before stopping',
							},
							{
								displayName: 'Return Tool Steps',
								name: 'returnIntermediateSteps',
								type: 'boolean',
								default: false,
								description: 'Whether to return detailed information about tool execution steps',
							},
						],
						description: 'Advanced options for tool execution when tools are connected',
					},
				],
			},
		],
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Agents', 'Language Models'],
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
		try {
			return await dynamicAgentExecute.call(this);
		} catch (error) {
			if (this.continueOnFail()) {
				return [
					[
						{
							json: {
								error: error.message,
								timestamp: new Date().toISOString(),
							},
						},
					],
				];
			}
			throw new NodeOperationError(this.getNode(), error);
		}
	}
}
