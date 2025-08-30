# 📝 YAML Messages Guide

## 🎯 **Overview**
El nodo Dynamic Agent ahora usa **YAML** para los mensajes dinámicos, eliminando todos los problemas de caracteres especiales que existían con JSON.

## ✅ **Ventajas de YAML**
- ✅ **Multilinea natural** - Sin escape necesario
- ✅ **Comillas mixtas** - `"`, `'`, y `` ` `` funcionan perfectamente
- ✅ **Markdown friendly** - ``` code blocks funcionan sin problemas
- ✅ **Más legible** - Formato limpio y organizado
- ✅ **Comentarios** - Puedes agregar comentarios con `#`

## 🚀 **Ejemplos de Uso**

### **Ejemplo Básico:**
```yaml
# Configuración simple
- role: system
  content: "Eres un asistente hotelero experto"

- role: user
  content: "Hola, ¿qué habitaciones tienen?"
```

### **Ejemplo con Contenido Multilinea:**
```yaml
- role: system
  content: |
    Eres un asistente hotelero especializado.
    
    Tu misión es:
    - Ayudar con reservas
    - Responder preguntas sobre servicios
    - Ser amigable y profesional
    
    Puedes usar frases como: "¡En nuestro hotel se come excelente!"

- role: user
  content: "Cuéntame sobre sus servicios"
```

### **Ejemplo con Código/Markdown:**
```yaml
- role: assistant
  content: |
    Aquí tienes los pasos para hacer una reserva:
    
    ```bash
    1. Seleccionar fechas
    2. Elegir habitación
    3. Confirmar reserva
    ```
    
    También puedes usar comillas: "dobles" y 'simples' sin problemas.
    Y backticks como `este` funcionan perfectamente.
```

### **Ejemplo Avanzado con Comentarios:**
```yaml
# Configuración del sistema principal
- role: system
  content: |
    # Hotel Paradise Configuration
    
    Eres el asistente virtual del Hotel Paradise ubicado en Playa del Carmen.
    
    ## Servicios disponibles:
    - 🏊 Piscina infinity 
    - 🍽️ Restaurante gourmet
    - 💆 Spa y wellness center
    - 🏖️ Acceso directo a playa privada
    
    ## Política de precios:
    - Suite presidencial: $200/noche
    - Habitación estándar: $80/noche  
    - Habitación familiar: $120/noche
    
    **Importante:** Siempre sé entusiasta y menciona las promociones actuales.

# Contexto de la conversación
- role: user
  content: "Hola, busco una habitación para 2 personas del 15 al 20 de marzo"

# Respuesta esperada del asistente
- role: assistant  
  content: |
    ¡Hola! ¡Qué emocionante que elijas Hotel Paradise para tu estancia!
    
    Para 2 personas del 15 al 20 de marzo (5 noches), te recomiendo:
    
    🏨 **Habitación Estándar** - $80/noche
    - Cama king size
    - Vista al jardín
    - Aire acondicionado
    - **Total: $400 (5 noches)**
    
    🌟 **Suite Presidencial** - $200/noche  
    - Vista al mar
    - Jacuzzi privado
    - Servicio a la habitación 24h
    - **Total: $1,000 (5 noches)**
    
    🎉 **¡Promoción especial!** Si reservas hoy, obtienes 15% descuento en tratamientos de spa.
    
    ¿Te interesa alguna de estas opciones? ¿Necesitas más detalles?
```

## 🛠️ **Migración desde JSON**

### **Antes (JSON problemático):**
```json
[
  {
    "role": "system", 
    "content": "Eres asistente.\n\nPuedes decir \"Hola\" y usar 'comillas'"
  }
]
```

### **Ahora (YAML sin problemas):**
```yaml
- role: system
  content: |
    Eres asistente.
    
    Puedes decir "Hola" y usar 'comillas' sin problemas.
    También `backticks` y ```code blocks``` funcionan perfecto.
```

## 🎯 **Best Practices**

1. **Usa `|` para contenido multilinea:**
   ```yaml
   content: |
     Línea 1
     Línea 2
     Línea 3
   ```

2. **Agrega comentarios para organizar:**
   ```yaml
   # Configuración del sistema
   - role: system
     content: "..."
   
   # Conversación del usuario
   - role: user
     content: "..."
   ```

3. **No necesitas escapar caracteres especiales:**
   ```yaml
   content: 'Texto con "comillas" y `backticks` y más "comillas"'
   ```

4. **Usa indentación consistente (2 espacios recomendado):**
   ```yaml
   - role: system
     content: |
       Contenido con
       múltiples líneas
   ```

¡Ahora puedes crear mensajes dinámicos complejos sin preocuparte por caracteres especiales! 🎉
