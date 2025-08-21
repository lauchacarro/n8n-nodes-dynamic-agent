# 📋 Análisis de Integración de Tools en N8N Agent

## 🎯 **Objetivo del Análisis**
Entender completamente cómo se implementa el sistema de Tools (herramientas) como sub-nodos en el Agent N8N existente para implementarlo en nuestro CustomAgent.

---

## 🏗️ **Arquitectura de Tools en N8N**

### **1. Estructura de Inputs (Entradas)**
El sistema de tools se configura a través de **inputs dinámicos** que permiten conectar múltiples herramientas:

```typescript
// En utils.ts - Configuración dinámica de inputs
{
    displayName: 'Tool',
    type: 'ai_tool',
    // CLAVE: Sin maxConnections definido = múltiples conexiones permitidas
}

// Comparación con otros inputs:
{
    type: 'ai_languageModel',
    maxConnections: 1,  // Solo una conexión
}
```

**🔑 Puntos Clave:**
- **`ai_tool`**: Tipo de conexión específico para herramientas
- **Sin `maxConnections`**: Permite conectar **0, 1, o múltiples tools**
- **Dinámico**: Los inputs se calculan en tiempo de ejecución

### **2. Obtención de Tools Conectadas**
Las tools se obtienen mediante la función `getConnectedTools()`:

```typescript
// En common.ts
export async function getTools(
    ctx: IExecuteFunctions | ISupplyDataFunctions,
    outputParser?: N8nOutputParser,
): Promise<Array<DynamicStructuredTool | Tool>> {
    // Obtiene todas las tools conectadas al input ai_tool
    const tools = (await getConnectedTools(ctx, true, false)) as Array<DynamicStructuredTool | Tool>;

    // Si hay output parser, agrega una tool especial para formatear
    if (outputParser) {
        const structuredOutputParserTool = new DynamicStructuredTool({
            schema: getOutputParserSchema(outputParser),
            name: 'format_final_json_response',
            description: 'Use this tool to format your final response...',
            func: async () => '',
        });
        tools.push(structuredOutputParserTool);
    }
    
    return tools;
}
```

**🔑 Puntos Clave:**
- **`getConnectedTools(ctx, true, false)`**: Función helper que obtiene todas las tools conectadas
- **Array dinámico**: Puede estar vacío, tener 1 o múltiples tools
- **Tool adicional**: Se agrega automáticamente si hay output parser

### **3. Integración con LangChain Agent**
Las tools se pasan al agente LangChain:

```typescript
// En execute.ts
const agent = createToolCallingAgent({
    llm: model,
    tools,  // Array de tools obtenidas
    prompt,
    streamRunnable: false,
});

const executor = AgentExecutor.fromAgentAndTools({
    agent: runnableAgent,
    memory,
    tools,  // Mismas tools
    maxIterations: options.maxIterations ?? 10,
});
```

**🔑 Puntos Clave:**
- **`createToolCallingAgent`**: Recibe el array de tools
- **`AgentExecutor`**: También necesita las tools para la ejecución
- **Flexibilidad**: Funciona con 0, 1 o múltiples tools

---

## 🔧 **Implementación en CustomAgent**

### **Paso 1: Agregar Input de Tools**
Modificar `node-inputs.ts`:

```typescript
export function getInputs(): Array<NodeConnectionType | INodeInputConfiguration> {
    return [
        NodeConnectionType.Main,
        {
            type: 'ai_languageModel',
            displayName: 'Language Model',
            required: true,
            maxConnections: 1,
        },
        {
            type: 'ai_tool',
            displayName: 'Tool',
            required: false,
            // Sin maxConnections = múltiples conexiones permitidas
        },
    ];
}
```

### **Paso 2: Crear Utilidad para Obtener Tools**
Crear `tools-handler.ts`:

```typescript
import { getConnectedTools } from '@utils/helpers';
import type { IExecuteFunctions } from 'n8n-workflow';
import type { DynamicStructuredTool, Tool } from 'langchain/tools';

export async function getConnectedAgentTools(
    ctx: IExecuteFunctions,
): Promise<Array<DynamicStructuredTool | Tool>> {
    try {
        // Obtener todas las tools conectadas al input ai_tool
        const tools = (await getConnectedTools(ctx, true, false)) as Array<DynamicStructuredTool | Tool>;
        return tools || [];
    } catch (error) {
        // Si no hay tools conectadas, retornar array vacío
        console.log('No tools connected:', error.message);
        return [];
    }
}
```

### **Paso 3: Integrar en la Ejecución**
Modificar `execute.ts`:

```typescript
import { getConnectedAgentTools } from './tools-handler';

// En la función customAgentExecute:
export async function customAgentExecute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // ... código existente ...

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
            // Obtener tools conectadas (puede ser array vacío)
            const connectedTools = await getConnectedAgentTools(this);

            // Obtener AI model conectado
            const languageModel = await getConnectedLanguageModel(this, itemIndex);

            // Procesar mensajes
            const processedMessages = await processMessages(this, itemIndex);

            // Ejecutar con AI (con o sin tools)
            const responseOutput = await executeWithLanguageModelAndTools(
                languageModel,
                processedMessages,
                connectedTools  // Pasar las tools
            );

            // ... resto del procesamiento ...
        }
    }
}
```

### **Paso 4: Crear Función de Ejecución con Tools**
Crear `ai-tools-execution.ts`:

```typescript
import type { BaseLanguageModel } from '@langchain/core/language_models/base';
import type { DynamicStructuredTool, Tool } from 'langchain/tools';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export async function executeWithLanguageModelAndTools(
    languageModel: BaseLanguageModel,
    messages: Array<{ role: string; content: string }>,
    tools: Array<DynamicStructuredTool | Tool>
): Promise<string> {
    // Crear prompt desde mensajes
    const promptMessages = messages.map(msg => 
        msg.role === 'system' ? ['system', msg.content] :
        msg.role === 'user' ? ['human', msg.content] :
        ['assistant', msg.content]
    );

    // Agregar placeholder para agent scratchpad si hay tools
    if (tools.length > 0) {
        promptMessages.push(['placeholder', '{agent_scratchpad}']);
    }

    const prompt = ChatPromptTemplate.fromMessages(promptMessages);

    // Si hay tools, usar agente con tools
    if (tools.length > 0) {
        const agent = createToolCallingAgent({
            llm: languageModel,
            tools,
            prompt,
        });

        const executor = AgentExecutor.fromAgentAndTools({
            agent,
            tools,
            maxIterations: 10
        });

        const result = await executor.invoke({
            input: messages[messages.length - 1]?.content || '',
        });

        return result.output;
    } else {
        // Si no hay tools, ejecutar directamente
        const result = await languageModel.invoke(promptMessages);
        return result.content;
    }
}
```

---

## 🎨 **Configuración de UI**

### **Opciones para Tools (Opcional)**
Agregar configuración en `CustomAgent.node.ts`:

```typescript
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
            description: 'Maximum number of tool calls the agent can make',
        }
    ],
},
```

---

## ✅ **Casos de Uso Soportados**

### **1. Sin Tools (0 tools)**
```
[CustomAgent] ← [ChatGPT] ← [Input]
```
- El agente funciona como chat simple
- No hay tool calling disponible

### **2. Una Tool (1 tool)**
```
[CustomAgent] ← [ChatGPT] ← [Input]
      ↑
[Calculator Tool]
```
- El agente puede usar la calculadora cuando sea necesario
- Tool calling habilitado

### **3. Múltiples Tools (N tools)**
```
[CustomAgent] ← [ChatGPT] ← [Input]
      ↑
[Calculator Tool]
[Search Tool]
[Email Tool]
```
- El agente puede elegir entre múltiples herramientas
- Máxima flexibilidad

---

## 🔄 **Flujo de Ejecución con Tools**

1. **Input Processing**: Procesar mensajes de entrada
2. **Tool Discovery**: `getConnectedTools()` obtiene todas las tools conectadas
3. **Agent Creation**: 
   - Si hay tools → `createToolCallingAgent()` + `AgentExecutor`
   - Si no hay tools → Ejecución directa del modelo
4. **Execution**: El agente decide automáticamente cuándo usar tools
5. **Output**: Respuesta final (con o sin tool usage)

---

## 🚀 **Implementación Inmediata**

**Archivos a modificar/crear:**
1. `node-inputs.ts` - Agregar input ai_tool
2. `tools-handler.ts` - Crear (nueva utilidad)
3. `ai-tools-execution.ts` - Crear (nueva ejecución)
4. `execute.ts` - Integrar tools en ejecución principal
5. `CustomAgent.node.ts` - (Opcional) Agregar opciones de tools

**Beneficios:**
- ✅ **0 tools**: Funciona como chat simple
- ✅ **1+ tools**: Tool calling automático
- ✅ **Flexible**: El agente decide cuándo usar tools
- ✅ **Compatible**: Usa el mismo sistema que N8N Agent
