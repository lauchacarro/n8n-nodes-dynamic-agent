# 🏗️ YAML Message Builder Node

## 📋 **Overview**
El **YAML Message Builder** es un nodo súper simple que genera mensajes YAML perfectamente formateados para usar con el **Dynamic AI Agent**. Solo dos inputs: rol y contenido. ¡Cero configuración, cero problemas!

## ✨ **Features**
- ✅ **Ultra simple** - Solo rol + contenido
- ✅ **Zero configuration** - Sin opciones complejas
- ✅ **Perfect output** - YAML array listo para Dynamic Agent
- ✅ **Any content** - Comillas, saltos de línea, código, sin escape
- ✅ **Role validation** - Automático
- ✅ **Clean format** - Siempre legible y consistente

## 🎯 **Super Simple Usage**

### **Input:**
- **Role:** `system` | `user` | `assistant`
- **Content:** Cualquier texto (multilinea, comillas, código, etc.)

### **Output:**
```yaml
- role: system
  content: |
    Tu contenido aquí...
    Con múltiples líneas
    "Comillas dobles" y 'simples'
    `Backticks` y ```code blocks```
    ¡Sin problemas de escape!
```

## 🔧 **Configuration**

**Just 2 fields:**
- **Message Role**: `system` | `user` | `assistant`  
- **Message Content**: Tu contenido (sin límites ni restricciones)

**¡Eso es todo!** Sin opciones, sin configuraciones complejas, sin dolor de cabeza.

## 🚀 **Workflow Example**

```
[YAML Message Builder] → Role: system, Content: Complex multiline
           ↓
[Dynamic AI Agent] → Message Mode: YAML Array
           ↓
    Perfect AI Response
```

## 📊 **Output Structure**

```json
{
  "output": "- role: system\n  content: |\n    Your message here...",
  "meta": {
    "role": "system",
    "contentLength": 156,
    "format": "array",
    "hasMultiline": true,
    "generatedAt": "2025-08-30T03:10:46.000Z"
  }
}
```

## 🎯 **Perfect For**

### **✅ System Messages with Context**
```yaml
- role: system
  content: |
    Eres un experto en hotelería especializado en Hotel Paradise.
    
    Contexto:
    - Ubicación: Playa del Carmen, México
    - Servicios: Spa, Piscina, Restaurante, Bar
    - Política: Siempre mencionar promociones actuales
    
    Ejemplos de frases:
    - "¡En nuestro hotel se come excelente!"
    - "Tenemos spa con tratamientos únicos"
    - "La piscina tiene vista al mar"
```

### **✅ User Questions**
```yaml
- role: user
  content: "Hola, busco una habitación para 2 personas del 15 al 20 de marzo. ¿Qué opciones tienen?"
```

### **✅ Assistant Examples**
```yaml
- role: assistant
  content: |
    ¡Perfecto! Para esas fechas tenemos:
    
    🏨 **Habitación Estándar** - $80/noche
    - Vista al jardín
    - Aire acondicionado
    - WiFi gratuito
    
    🌟 **Suite con Vista al Mar** - $150/noche
    - Balcón privado
    - Minibar incluido
    - Servicio de habitación
    
    ¿Te interesa alguna de estas opciones?
```

## 🔗 **Integration with Dynamic AI Agent**

1. **YAML Message Builder** → Genera formato perfecto 
2. **Dynamic AI Agent** → Recibe en `Message Mode: YAML Array`
3. **Zero errors** → Garantizado siempre

## ⚡ **Why This Approach Rocks**

- ✅ **No escaping** - Cualquier carácter funciona
- ✅ **No indentation issues** - Formato perfecto automático
- ✅ **No configuration** - Solo rol + contenido
- ✅ **Consistent output** - Siempre el mismo estilo
- ✅ **Ready to use** - Directo a Dynamic Agent

## 💡 **Pro Tips**

1. **Para mensajes complejos**: Usa multilinea sin miedo
2. **Para código**: ``` bloques funcionan perfecto
3. **Para comillas**: Mezcla "dobles" y 'simples' libremente
4. **Para ejemplos**: Crea conversaciones reales

¡Nunca más problemas de YAML! 🎉 Simple, directo, y funciona siempre.
