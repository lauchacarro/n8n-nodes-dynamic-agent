# Análisis de Sub-Nodos de AI en N8N

## Introducción
Después de analizar tanto el nodo "Basic LLM Chain" (ChainLLM) como el "AI Agent" (old-agent), he identificado los patrones y diferencias clave en cómo implementan las conexiones de sub-nodos AI.

## Patrones de Implementación de Sub-Nodos AI

### 1. **Basic LLM Chain (ChainLLM)** - Implementación Simple y Funcional

#### Configuración de Inputs (`config.ts`)
```typescript
export function getInputs(parameters: IDataObject) {
	const inputs: INodeInputConfiguration[] = [
		{ displayName: '', type: 'main' },
		{
			displayName: 'Model',
			maxConnections: 1,
			type: 'ai_languageModel',  // ✅ Tipo correcto
			required: true,
		},
	];
	
	// Opcional: Fallback Model y Output Parser
	// ...
	return inputs;
}
```

#### Uso en Node Definition
```typescript
inputs: `={{ ((parameter) => { ${getInputs.toString()}; return getInputs(parameter) })($parameter) }}`,
```

#### Obtención del Modelo Conectado (`processItem.ts`)
```typescript
import { NodeConnectionTypes } from 'n8n-workflow';

async function getChatModel(ctx: IExecuteFunctions, index: number = 0): Promise<BaseLanguageModel | undefined> {
	const connectedModels = await ctx.getInputConnectionData(
		NodeConnectionTypes.AiLanguageModel,  // ✅ Uso correcto
		0
	);
	
	// Manejo de array de modelos si hay múltiples conexiones
	let model;
	if (Array.isArray(connectedModels) && index !== undefined) {
		const reversedModels = [...connectedModels].reverse();
		model = reversedModels[index] as BaseLanguageModel;
	} else {
		model = connectedModels as BaseLanguageModel;
	}
	
	return model;
}

export const processItem = async (ctx: IExecuteFunctions, itemIndex: number) => {
	const llm = await getChatModel(ctx, 0);
	assert(llm, 'Please connect a model to the Chat Model input');  // ✅ Validación
	
	// Usar el modelo para ejecutar la cadena
	return await executeChain({
		context: ctx,
		itemIndex,
		query: prompt,
		llm,  // ✅ Modelo real conectado
		// ...
	});
};
```

### 2. **AI Agent (old-agent)** - Implementación Compleja Multi-Conexión

#### Configuración de Inputs (`V2/utils.ts`)
```typescript
export function getInputs(
	hasMainInput?: boolean,
	hasOutputParser?: boolean,
	needsFallback?: boolean,
): Array<NodeConnectionType | INodeInputConfiguration> {
	
	let specialInputs: SpecialInput[] = [
		{
			type: 'ai_languageModel',  // ✅ String que se convierte a tipo
			displayName: 'Chat Model',
			required: true,
		},
		{
			type: 'ai_languageModel',
			displayName: 'Fallback Model',
			required: true,
		},
		{
			displayName: 'Memory',
			type: 'ai_memory',
		},
		{
			displayName: 'Tool',
			type: 'ai_tool',
		},
		{
			displayName: 'Output Parser',
			type: 'ai_outputParser',
		},
	];
	
	// Filtros condicionales basados en parámetros
	// ...
}
```

#### Uso en Node Definition
```typescript
inputs: `={{
	((hasOutputParser, needsFallback) => {
		${getInputs.toString()};
		return getInputs(true, hasOutputParser, needsFallback);
	})($parameter.hasOutputParser === undefined || $parameter.hasOutputParser === true, $parameter.needsFallback !== undefined && $parameter.needsFallback === true)
}}`,
```

## Diferencias Clave Entre Implementaciones

| Aspecto | ChainLLM (Simple) | AI Agent (Complejo) |
|---------|-------------------|---------------------|
| **Conexiones AI** | Solo Language Model + Output Parser opcional | Language Model + Memory + Tools + Output Parser |
| **Configuración** | Estática con parámetros simples | Dinámica con expresiones complejas |
| **Validación** | Assert simple con mensaje claro | Múltiples validaciones condicionales |
| **Obtención de Datos** | `NodeConnectionTypes.AiLanguageModel` | Tipos string convertidos |
| **Complejidad** | ~50 líneas de configuración | ~200+ líneas de configuración |
| **Funcionalidad** | ✅ Funciona correctamente | ❌ No funciona en nuestro caso |

## Por Qué el AI Agent (old-agent) No Funciona en Nuestro Caso

### Problemas Identificados:

1. **Tipos Incorrectos**: Usa strings como `'ai_languageModel'` en lugar de `NodeConnectionTypes.AiLanguageModel`
2. **Expresiones Complejas**: La expresión de inputs es demasiado compleja y puede fallar
3. **Dependencias Faltantes**: Requiere utilidades que no están disponibles en nuestro entorno
4. **Validación Insuficiente**: No valida correctamente las conexiones

### Lo Que Funciona en ChainLLM:

1. **Tipos Correctos**: Usa `NodeConnectionTypes.AiLanguageModel` 
2. **Configuración Simple**: Inputs directos sin expresiones complejas
3. **Validación Clara**: Assert con mensajes de error específicos
4. **Obtención Directa**: `getInputConnectionData(NodeConnectionTypes.AiLanguageModel, 0)`

## Recomendaciones de Implementación

### Para Nuestro Custom Agent:

1. **Seguir el Patrón de ChainLLM**: Es simple, funcional y probado
2. **Una Sola Conexión**: Solo Language Model (como pediste)
3. **Tipos Correctos**: Usar `NodeConnectionTypes.AiLanguageModel`
4. **Validación Simple**: Assert con mensaje claro
5. **Sin Expresiones Complejas**: Configuración estática de inputs

### Estructura Recomendada:

```typescript
// 1. Configuración de Inputs (simple)
inputs: [
	NodeConnectionTypes.Main,
	{
		displayName: 'Model',
		type: 'ai_languageModel',  // Tipo correcto
		maxConnections: 1,
		required: true,
	}
]

// 2. Obtención del Modelo (directo)
const llm = await this.getInputConnectionData(NodeConnectionTypes.AiLanguageModel, 0);
assert(llm, 'Please connect a language model to the Model input');

// 3. Uso del Modelo (real)
const response = await llm.invoke(prompt);
```

## Conclusión

El **Basic LLM Chain** demuestra la implementación correcta y funcional de sub-nodos AI en N8N. Su simplicidad es su fortaleza. El **AI Agent** es más complejo pero su implementación tiene problemas que impiden su correcto funcionamiento.

Para nuestro Custom Agent, implementaremos la solución basada en los patrones exitosos de ChainLLM, enfocándonos únicamente en la conexión del Language Model como solicitaste.
