# AI Sub-Node Connections - Setup Guide

## Overview
The Custom AI Agent now supports connecting to AI sub-nodes, making it compatible with N8N's AI ecosystem while maintaining all the flexible message configuration capabilities.

## Available Sub-Node Connections

### 🤖 **Chat Model** (Required)
Connect an AI Language Model node to enable real AI responses:
- **OpenAI GPT Models**: GPT-3.5-turbo, GPT-4, GPT-4-turbo
- **Anthropic Claude**: Claude-3 family models  
- **Local Models**: Ollama, LMStudio
- **Other Providers**: Cohere, Hugging Face, etc.

### 🧠 **Memory** (Optional)
Connect memory nodes for conversation history:
- **Buffer Memory**: Simple conversation history
- **Window Memory**: Sliding window of recent messages
- **Summary Memory**: Compressed conversation summaries
- **Vector Store Memory**: Semantic memory with embeddings

### 🔧 **Tools** (Optional)  
Connect tool nodes for extended capabilities:
- **Search Tools**: Web search, database queries
- **API Tools**: REST API calls, webhooks
- **File Tools**: Read/write files, PDF processing
- **Math Tools**: Calculations, data analysis

### 📝 **Output Parser** (Optional)
Connect output parsers for structured responses:
- **JSON Parser**: Extract structured JSON data
- **XML Parser**: Parse XML responses
- **CSV Parser**: Tabular data extraction
- **Custom Parsers**: Regex, template-based parsing

## Connection Setup

### Basic AI Model Connection
1. Add your Custom AI Agent node to the workflow
2. Add an AI Language Model node (e.g., OpenAI GPT)
3. Connect the Language Model to the "Chat Model" input of the Custom Agent
4. Configure your message modes and user input
5. Execute - you'll get real AI responses!

### Advanced Multi-Connection Setup
```
[OpenAI GPT-4] ──── Chat Model ────┐
                                   │
[Buffer Memory] ─── Memory ────────┤
                                   ├── [Custom AI Agent] ── [Output]
[Search Tool] ──── Tool ───────────┤
                                   │
[JSON Parser] ──── Output Parser ──┘
```

## Message Configuration with AI Models

### Example: Customer Service with Context
```json
[
  {
    "role": "system", 
    "content": "You are a professional customer service representative. Be empathetic and solution-focused."
  },
  {
    "role": "user",
    "content": "I received a damaged product yesterday"
  },
  {
    "role": "assistant", 
    "content": "I'm sorry to hear about the damaged product. Let me help you with a replacement right away."
  },
  {
    "role": "system",
    "content": "Always offer expedited shipping for damaged items at no extra cost."
  }
]
```

**User Input**: "Can you help me with the replacement process?"

**AI Response**: The connected model will process all the context messages and respond appropriately based on the configured personality and conversation history.

## Fallback Behavior

### No AI Model Connected
- Shows message configuration interface
- Demonstrates message processing
- Provides mock responses
- Displays connection prompt: *"💡 Connect an AI Language Model to get real responses"*

### AI Model Connected  
- Processes messages through the actual AI model
- Uses real language understanding
- Applies configured message context
- Returns authentic AI responses

## Migration from Mock to Real AI

### Before (Mock Mode)
```
Custom AI Agent (standalone)
├── Message Configuration ✓
├── Token Calculation ✓  
└── Mock Responses ✓
```

### After (AI-Connected Mode)
```
Custom AI Agent + Connected AI Model
├── Message Configuration ✓
├── Real AI Processing ✓
├── Authentic Responses ✓
├── Token Calculation ✓
└── Sub-node Integration ✓
```

## Benefits of Sub-Node Architecture

1. **Flexibility**: Choose any compatible AI model
2. **Modularity**: Mix and match different AI components
3. **Scalability**: Add tools and memory as needed  
4. **Compatibility**: Works with existing N8N AI workflows
5. **Future-Proof**: Easy to integrate new AI capabilities

## Performance Considerations

- **Memory Usage**: Larger conversation histories consume more tokens
- **Tool Latency**: Multiple tool calls increase response time
- **Model Selection**: Choose models appropriate for your use case
- **Cost Management**: Monitor token usage with built-in tracking

## Next Steps

1. **Connect a basic AI model** to test real responses
2. **Add memory** for conversation continuity  
3. **Integrate tools** for extended capabilities
4. **Configure output parsing** for structured data
5. **Scale up** to complex multi-agent workflows

The Custom AI Agent now bridges the gap between flexible message configuration and real AI processing, giving you the best of both worlds! 🚀
