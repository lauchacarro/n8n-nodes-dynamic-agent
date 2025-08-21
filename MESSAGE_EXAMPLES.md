# Custom Agent Node - Message Configuration Examples

## Overview
The Custom Agent Node now supports **mixed message types** with maximum flexibility:
- System messages for AI behavior configuration
- User messages for simulating user inputs
- Assistant messages for providing AI context/examples

## Configuration Modes

### 1. Individual Messages Mode
Configure messages one by one with role selection:

#### Example Configuration:
```
Message 1:
- Role: system
- Content: "You are a helpful customer service AI assistant. Always be polite and professional."

Message 2:
- Role: user  
- Content: "I'm having trouble with my order"

Message 3:
- Role: assistant
- Content: "I understand your concern. Let me help you with your order issue."

Message 4:
- Role: system
- Content: "If asked about refunds, always check company policy first."
```

### 2. JSON Array Mode
Configure all messages at once using JSON:

#### Example JSON:
```json
[
  {
    "role": "system",
    "content": "You are a helpful customer service AI assistant. Always be polite and professional."
  },
  {
    "role": "user", 
    "content": "I'm having trouble with my order"
  },
  {
    "role": "assistant",
    "content": "I understand your concern. Let me help you with your order issue."
  },
  {
    "role": "system",
    "content": "If asked about refunds, always check company policy first."
  }
]
```

## Use Cases

### Customer Service Training
```json
[
  {
    "role": "system",
    "content": "You are a customer service representative. Be empathetic and solution-focused."
  },
  {
    "role": "user",
    "content": "My product arrived damaged!"
  },
  {
    "role": "assistant", 
    "content": "I'm so sorry to hear that! Let me immediately start the replacement process for you."
  },
  {
    "role": "system",
    "content": "Always offer expedited shipping for damaged items."
  }
]
```

### Multi-turn Conversation Context
```json
[
  {
    "role": "system",
    "content": "You are a technical expert explaining complex topics simply."
  },
  {
    "role": "user",
    "content": "What is machine learning?"
  },
  {
    "role": "assistant",
    "content": "Machine learning is like teaching computers to recognize patterns and make predictions from data."
  },
  {
    "role": "user",
    "content": "Can you give me a simple example?"
  }
]
```

### Dynamic Personality Configuration
```json
[
  {
    "role": "system",
    "content": "Base personality: You are helpful and knowledgeable."
  },
  {
    "role": "system",
    "content": "Communication style: Use casual, friendly language."
  },
  {
    "role": "system", 
    "content": "Special instructions: Always end responses with a relevant emoji."
  },
  {
    "role": "assistant",
    "content": "Hey there! I'm ready to help you with whatever you need! 😊"
  }
]
```

## Benefits

1. **Maximum Flexibility**: Mix system, user, and assistant messages in any combination
2. **Context Control**: Provide conversation history and examples
3. **Behavior Tuning**: Multiple system messages for fine-tuned AI behavior
4. **Easy Configuration**: Choose between individual setup or JSON bulk input
5. **Token Tracking**: Comprehensive usage and cost tracking for all message types

## Node Output
The node provides detailed metadata including:
- Total message count
- Breakdown by message type (system/user/assistant)
- Token usage and cost estimation
- Execution time and performance metrics
