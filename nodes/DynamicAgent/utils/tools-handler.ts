// Tools handler for CustomAgent - manages connected AI tools
// Based on N8N Agent tools integration pattern

import type { IExecuteFunctions } from 'n8n-workflow';
import type { DynamicStructuredTool, Tool } from 'langchain/tools';

/**
 * Gets all connected AI tools from the ai_tool input
 * Returns empty array if no tools are connected (graceful handling)
 *
 * Note: This uses a simplified approach since we may not have access
 * to the exact same helper functions as the N8N core
 */
export async function getConnectedAgentTools(
	ctx: IExecuteFunctions,
): Promise<Array<DynamicStructuredTool | Tool>> {
	try {
		// Try to get tools using the pattern from N8N Agent
		// The string 'ai_tool' should work as it's the connection type
		const tools = await ctx.getInputConnectionData('ai_tool' as any, 0);

		if (!tools) {
			return [];
		}

		// Handle both single tool and multiple tools
		if (Array.isArray(tools)) {
			return tools as Array<DynamicStructuredTool | Tool>;
		} else {
			return [tools as DynamicStructuredTool | Tool];
		}
	} catch (error) {
		// If no tools are connected or there's an error, return empty array
		// This allows the agent to work without tools (0 tools case)
		console.log('No tools connected or error getting tools:', error.message);
		return [];
	}
}

/**
 * Validates that connected tools are compatible with the agent
 * @param tools Array of tools to validate
 * @returns boolean indicating if tools are valid
 */
export function validateConnectedTools(tools: Array<DynamicStructuredTool | Tool>): boolean {
	if (!Array.isArray(tools)) {
		return false;
	}

	// Check that each tool has the required properties
	return tools.every(tool =>
		tool &&
		typeof tool.name === 'string' &&
		typeof tool.description === 'string' &&
		typeof tool.call === 'function'
	);
}

/**
 * Gets summary information about connected tools for logging/debugging
 */
export function getToolsSummary(tools: Array<DynamicStructuredTool | Tool>): string {
	if (tools.length === 0) {
		return 'No tools connected - operating in simple chat mode';
	}

	const toolNames = tools.map(tool => tool.name).join(', ');
	return `${tools.length} tool(s) connected: ${toolNames}`;
}
