# Product Requirements Document (PRD) - Custom N8N Agent Node

## Resumen del Producto
Un nodo personalizado de N8N que proporciona mayor flexibilidad para la configuración y manipulación de mensajes en agentes de IA, permitiendo configuración dinámica de mensajes del sistema sin restricciones de inputs o selects predefinidos.

## Objetivos del Producto
- Crear un nodo de agente personalizado con máxima flexibilidad de configuración
- Permitir múltiples mensajes del sistema ordenables dinámicamente
- Simplificar la arquitectura eliminando subnodos innecesarios
- Proporcionar información detallada sobre el consumo de tokens

## Funcionalidades Principales

### 1. Configuración de Mensajes Dinámica
- **Múltiples mensajes del sistema**: Capacidad de agregar N cantidad de mensajes del sistema
- **Orden personalizable**: Los mensajes pueden ser reordenados según las necesidades del usuario
- **Sin restricciones de UI**: No usar inputs ni selects predefinidos, sino campos de texto libres

### 2. Arquitectura Simplificada
- **SubNodo de Modelo**: Conexión directa al modelo LLM
- **SubNodo de Tools**: Conexión para herramientas disponibles
- **Sin SubNodo de Memoria**: Eliminación del componente de memoria para simplificar

### 3. Output Detallado
- **Respuesta del LLM**: Output principal con la respuesta generada
- **Consumo de Tokens**: Información detallada sobre tokens utilizados
- **Metadatos adicionales**: Información sobre el proceso de ejecución

## Especificaciones Técnicas

### Inputs
- **Modelo (requerido)**: Conexión al modelo LLM
- **Tools (opcional)**: Conexión a herramientas disponibles
- **Input Data**: Datos de entrada del workflow

### Configuración
- **Mensajes del Sistema**: Array dinámico de mensajes configurables
- **Opciones de Ejecución**: Configuraciones específicas del agente
- **Configuración de Streaming**: Habilitación/deshabilitación de streaming

### Outputs
```json
{
  "response": "Respuesta del LLM",
  "tokenUsage": {
    "prompt": 150,
    "completion": 75,
    "total": 225
  },
  "metadata": {
    "model": "gpt-4",
    "executionTime": 1250,
    "toolsUsed": ["tool1", "tool2"]
  }
}
```

## Casos de Uso
1. **Agentes Complejos**: Crear agentes con múltiples contextos y roles específicos
2. **Workflows Personalizados**: Adaptar el comportamiento del agente según el flujo de trabajo
3. **Análisis de Costos**: Monitorear el consumo de tokens para optimización de costos
4. **Desarrollo Iterativo**: Facilitar la experimentación con diferentes configuraciones de mensajes

## Criterios de Aceptación
Ver Definition of Done (DoD.md)

## Restricciones y Limitaciones
- Compatible con N8N v1.0+
- Requiere conexión a modelo LLM compatible
- Máximo 100 mensajes del sistema por configuración
- Soporte para tokens hasta el límite del modelo conectado

## Dependencias Técnicas
- N8N Core
- LangChain
- Modelos LLM compatibles
- TypeScript/JavaScript

## Roadmap
1. **Fase 1**: Estructura básica y configuración de mensajes
2. **Fase 2**: Integración con modelos y tools
3. **Fase 3**: Sistema de tokens y metadatos
4. **Fase 4**: Optimizaciones y pulido
5. **Fase 5**: Empaquetado NPM y documentación
