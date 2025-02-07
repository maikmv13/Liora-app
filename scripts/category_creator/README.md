# Generador de Categorías e Ingredientes

Este script permite generar y mantener una estructura jerárquica de alimentos e ingredientes de cocina, utilizando GPT-3.5-turbo para validación y sugerencias.

## Estructura del Proyecto
```
scripts/category_creator/
├── category_creator.py    # Script principal
├── README.md             # Esta documentación
└── results/              # Directorio para resultados
    ├── current_structure.json     # Estructura completa actual
    ├── simple_structure.json      # Vista simplificada
    └── temp_ingredients.json      # Archivo temporal para ediciones
```

## Proceso de Categorización

El script sigue un proceso jerárquico de tres niveles:

### 1. Nivel Vertical
- Análisis de solapamientos entre verticales
  - Identifica conflictos con otras verticales
  - Establece criterios claros de diferenciación
  - Resuelve ambigüedades de clasificación

### 2. Nivel Categoría
- Validación de categorías dentro de cada vertical
  - Evalúa cobertura completa
  - Detecta solapamientos internos
  - Permite añadir/eliminar/renombrar categorías

### 3. Nivel Subcategoría
- Gestión de subcategorías y sus ingredientes
  - Valida exclusividad mutua
  - Asegura clasificación clara
  - Procesa ingredientes con validación

## Unidades y Tipos

### Unidades de Medida Permitidas
- Peso: g, ml
- Unidades: unidad, diente, cabeza, rama, etc.
- Medidas de cocina: cucharada, cucharadita, taza, etc.
- Envases: lata, paquete, botella, etc.

### Tipos de Alimentos
- fresco: Estado natural
- congelado: Preservado por congelación
- conserva: En conserva/enlatado
- seco: Deshidratado/seco
- procesado: Con algún procesamiento

## Uso del Script

1. **Preparación**
   ```bash
   # Configurar archivo .env con API key
   OPENAI_API_KEY=tu-api-key
   ```

2. **Menú Principal**
   - Procesar verticales
   - Generar vista simplificada
   - Actualizar estructura

3. **Proceso de Edición**
   - Para cada nivel (vertical/categoría/subcategoría):
     - Análisis automático de estructura
     - Sugerencias de mejora
     - Opciones de edición manual

4. **Validación de Ingredientes**
   - Unidad de medida válida
   - Tipo de alimento permitido
   - Lista de nombres alternativos

## Archivos Generados

- `current_structure.json`: Estructura completa con todos los detalles
- `simple_structure.json`: Vista simplificada para revisión rápida
- `temp_ingredients.json`: Archivo temporal para ediciones manuales

## Notas

- El script mantiene consistencia entre verticales
- Evita duplicaciones de ingredientes
- Guarda progreso automáticamente
- Permite interrumpir y continuar el proceso
- Enfocado en la cocina española