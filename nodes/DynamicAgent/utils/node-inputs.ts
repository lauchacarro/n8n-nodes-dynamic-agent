// AI Model connection configuration based on successful ChainLLM pattern

import {
	type INodeInputConfiguration,
	NodeConnectionType,
} from 'n8n-workflow';

/**
 * Simple and functional input configuration for AI Language Model connection and Tools
 * Based on the working ChainLLM implementation pattern and N8N Agent tools system
 */
export function getInputs(): Array<NodeConnectionType | INodeInputConfiguration> {
	const inputs: Array<NodeConnectionType | INodeInputConfiguration> = [
		// Main input for data flow
		NodeConnectionType.Main,

		// AI Language Model input - following ChainLLM pattern
		{
			displayName: 'Model',
			type: 'ai_languageModel' as NodeConnectionType,
			maxConnections: 1,
			required: true,
		},

		// Tools input - allows 0, 1, or multiple tools (no maxConnections = unlimited)
		{
			displayName: 'Tool',
			type: 'ai_tool' as NodeConnectionType,
			required: false,
		},
	];

	return inputs;
}
