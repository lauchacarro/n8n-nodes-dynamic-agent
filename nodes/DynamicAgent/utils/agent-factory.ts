import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { DynamicStructuredTool, Tool } from 'langchain/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

interface AgentOptions {
	maxIterations: number;
	timeout: number;
}

interface CreateAgentParams {
	model: BaseChatModel;
	tools: Array<DynamicStructuredTool | Tool>;
	systemMessages: string[];
	options: AgentOptions;
}

/**
 * Creates an agent with the specified model, tools, and configuration
 */
export async function createAgentWithTools({
	model,
	tools,
	systemMessages,
	options,
}: CreateAgentParams): Promise<AgentExecutor> {
	// Build the prompt template with system messages and user input
	const promptMessages = [
		...systemMessages.map((message) => SystemMessagePromptTemplate.fromTemplate(message)),
		HumanMessagePromptTemplate.fromTemplate('{input}'),
	];

	// Add agent scratchpad for tool usage
	promptMessages.push(HumanMessagePromptTemplate.fromTemplate('{agent_scratchpad}'));

	const prompt = ChatPromptTemplate.fromMessages(promptMessages);

	// Create the tool-calling agent
	const agent = createToolCallingAgent({
		llm: model,
		tools,
		prompt,
		streamRunnable: false,
	});

	// Create and return the executor
	const executor = AgentExecutor.fromAgentAndTools({
		agent,
		tools,
		maxIterations: options.maxIterations,
		returnIntermediateSteps: false,
		verbose: false,
	});

	return executor;
}
