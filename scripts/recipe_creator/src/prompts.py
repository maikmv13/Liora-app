from typing import Dict, List
import json

def get_recipe_name_prompt(recipe_type: str) -> str:
    return f'''Crea un nombre simple y directo para una receta de {recipe_type} que incluya:
    1. Plato principal (name): Usa nombres claros y directos del ingrediente principal y método de cocción
    2. Acompañamiento (side_dish): Máximo 2-3 guarniciones simples
    3. Descripción (short_description): Describe de forma técnica y precisa:
       - Método exacto de cocción y temperatura/tiempo
       - Ingredientes principales y su preparación
       - Técnicas culinarias utilizadas
       - Resultado final esperado
    
    El formato debe ser: 
    {{
        "name": "name",
        "side_dish": "con side_dish",
        "short_description": "Descripción técnica y precisa"
    }}
    
    Ejemplos:
    {{
        "name": "Solomillo de ternera a la plancha",
        "side_dish": "con puré de patatas y espárragos verdes",
        "short_description": "Solomillo de ternera marcado a fuego alto (200°C) durante 3-4 minutos por cada lado para lograr un punto medio. Servido con puré de patatas elaborado con mantequilla y nata, y espárragos verdes salteados brevemente en aceite de oliva con un toque de ajo."
    }}
    
    {{
        "name": "Merluza al horno",
        "side_dish": "con patatas panadera y pimientos",
        "short_description": "Lomos de merluza horneados a 180°C durante 15 minutos sobre base de patatas cortadas en rodajas finas y pimientos asados. La patata se precocina 25 minutos antes de añadir el pescado, consiguiendo una textura crujiente por fuera y tierna por dentro."
    }}
    
    NO generes:
    ❌ Nombres rebuscados o poéticos
    ❌ Más de 3 elementos en el acompañamiento
    ❌ Descripciones subjetivas o floridas
    ❌ Técnicas de cocción ambiguas
    
    La descripción debe ser técnica, específica y enfocada en el método de preparación.'''

def get_ingredients_prompt(recipe_type: str, name: str, side_dish: str, short_description: str, ingredients_by_type: dict) -> str:
    return f'''Genera una lista de ingredientes para esta receta:

    Nombre: "{name}"
    Acompañamiento: "{side_dish}"
    Descripción: "{short_description}"
    
    REGLAS ESTRICTAS:
    1. Usa SIEMPRE el nombre más básico y conciso del ingrediente
    2. NO incluyas:
       - Formas de preparación (rallado, picado, en rodajas, etc.)
       - Adjetivos innecesarios (fresco, natural, etc.)
       - Palabras redundantes (queso parmesano → parmesano)
    3. Usa SOLO ingredientes de la lista proporcionada
    4. Mantén el formato en singular
    
    FORMATO DE RESPUESTA:
    [
        {{"name": "Parmesano", "quantity": 100, "unit": "gramos", "category": "Quesos Curados"}},
        {{"name": "Espagueti", "quantity": 1, "unit": "paquete", "category": "Pastas"}},
        {{"name": "Ajo", "quantity": 2, "unit": "dientes", "category": "Verduras Básicas"}}
    ]
    
    Ejemplos correctos:
    ✅ "Parmesano" (no "Queso parmesano rallado")
    ✅ "Ajo" (no "Dientes de ajo picados")
    ✅ "Zanahoria" (no "Zanahorias en rodajas")
    
    Ejemplos incorrectos:
    ❌ "Queso parmesano rallado"
    ❌ "Dientes de ajo picados"
    ❌ "Zanahorias frescas en rodajas"
    
    Lista de ingredientes permitidos:
    {json.dumps(ingredients_by_type, indent=2, ensure_ascii=False)}
    '''

def get_steps_prompt(ingredients: List[Dict]) -> str:
    """Genera el prompt para los pasos de la receta"""
    ingredient_list = "\n".join([
        f"{i+1}. {ing['name']} ({ing['quantity']} {ing['unit']})" 
        for i, ing in enumerate(ingredients)
    ])
    
    return f'''Crea los pasos de preparación usando ÚNICAMENTE estos ingredientes numerados:
    {ingredient_list}
    
    REGLAS ESTRICTAS:
    1. Usa EXACTAMENTE este formato para cada ingrediente:
       "{{quantity_X}} {{unit_X}} {{ingredient_X}}"
       donde X es el número del ingrediente en la lista
    2. Las variables deben ser texto literal, NO código Python
    3. NUNCA intentes evaluar o reemplazar las variables
    4. Cada paso debe comenzar con un emoji
    5. NO uses los valores directamente, solo las variables
    
    Ejemplo correcto:
    [
        "🥄 Mezcla {{quantity_1}} {{unit_1}} {{ingredient_1}} en un bol",
        "🔪 Añade {{quantity_2}} {{unit_2}} {{ingredient_2}} y {{quantity_3}} {{unit_3}} {{ingredient_3}}",
        "🍳 Incorpora {{quantity_4}} {{unit_4}} {{ingredient_4}} y cocina"
    ]
    
    Ejemplo incorrecto (NO hagas esto):
    [
        "🥄 Mezcla quantity_1 unit_1 ingredient_1",
        "🔪 Añade 2 cucharadas de harina",
        "🍳 Incorpora los ingredientes restantes"
    ]
    
    IMPORTANTE:
    - Las variables son texto literal, NO código Python
    - SIEMPRE usa las tres variables juntas: {{quantity_X}} {{unit_X}} {{ingredient_X}}
    - NO intentes evaluar o reemplazar las variables
    - NO uses los ingredientes directamente
    '''

def get_dietary_info_prompt(ingredients: List[Dict]) -> str:
    return f'''Analiza estos ingredientes y determina las restricciones dietéticas:
    {json.dumps(ingredients, indent=2, ensure_ascii=False)}
    
    Devuelve un objeto JSON con estos campos (true/false):
    {{
        "gluten_free": true/false,
        "lactose_free": true/false,
        "nut_free": true/false,
        "egg_free": true/false,
        "shellfish_free": true/false,
        "soy_free": true/false,
        "yeast_free": true/false,
        "sugar_free": true/false,
        "vegan": true/false,
        "vegetarian": true/false,
        "keto": true/false,
        "paleo": true/false
    }}
    
    IMPORTANTE: La respuesta debe ser un objeto JSON válido.
    '''

def get_nutrition_prompt(ingredients: List[Dict]) -> str:
    return f'''Calcula la información nutricional para estos ingredientes:
    {json.dumps(ingredients, indent=2, ensure_ascii=False)}
    
    Devuelve un objeto JSON con estos campos (valores numéricos por porción):
    {{
        "energy_kj": 1000,
        "calories": 240,
        "fats": 10.5,
        "saturated_fats": 2.3,
        "carbohydrates": 30.2,
        "sugars": 5.1,
        "fiber": 3.2,
        "proteins": 8.4
    }}
    
    IMPORTANTE: 
    1. La respuesta debe ser un objeto JSON válido
    2. Todos los valores deben ser números
    3. No incluyas unidades en los valores
    4. Calcula los valores para una porción
    '''

def get_image_prompt(name: str, short_description: str) -> str:
    return f'''Genera una fotografía hiperrealista de este plato:

    Plato: "{name}"
    Descripción: "{short_description}"
    
    ESTILO:
    - Fotografía de libro de recetas profesional
    - Aspecto apetitoso y natural
    - Luz suave y natural, como de ventana lateral
    - Colores vivos pero realistas
    - Texturas detalladas y definidas
    
    COMPOSICIÓN:
    - Plato principal centrado y bien presentado
    - Vista en ángulo de 45° para mostrar profundidad
    - Fondo limpio y desenfocado con elementos decorativos
    - Vajilla elegante pero sencilla
    
    AMBIENTE:
    - Mesa de madera clara o superficie neutra
    - Iluminación brillante y natural
    - Estilo minimalista y limpio
    - Aspecto fresco y contemporáneo
    
    NO INCLUIR:
    - Fondos oscuros o dramáticos
    - Efectos artificiales o sobreproducidos
    - Ángulos extremos o artísticos

    La imagen debe parecer una fotografía profesional de un libro de recetas moderno.''' 