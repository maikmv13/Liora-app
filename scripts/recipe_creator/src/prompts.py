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
    
    Usa ÚNICAMENTE ingredientes de estas categorías, respetando EXACTAMENTE sus nombres y categorías:
    {json.dumps(ingredients_by_type, indent=2, ensure_ascii=False)}
    
    IMPORTANTE:
    1. Usa EXACTAMENTE los nombres de los ingredientes como aparecen en la lista
    2. No agregues palabras como "filetes de" o "rodajas de" al nombre del ingrediente
    3. La cantidad y unidad deben ir separadas del nombre del ingrediente
    4. Si necesitas especificar el corte o preparación, hazlo en los pasos de la receta
    5. Incluye TODOS los ingredientes mencionados en la descripción
    6. Añade los ingredientes básicos necesarios aunque no estén en la descripción (sal, aceite, etc.)
    
    La respuesta debe ser un array JSON válido con este formato exacto:
    [
        {{"name": "Cebolla", "quantity": 1, "unit": "unidad", "category": "Verduras Básicas"}},
        {{"name": "Zanahoria", "quantity": 2, "unit": "unidad", "category": "Verduras de Raíz"}}
    ]
    
    Reglas:
    1. Los ingredientes deben corresponder con la descripción detallada de la receta
    2. El nombre del ingrediente debe existir EXACTAMENTE en la lista proporcionada
    3. La categoría debe coincidir EXACTAMENTE con la categoría del ingrediente en la lista
    4. La cantidad debe ser un número
    5. La unidad debe estar SIEMPRE en singular:
       - "unidad" (no "unidades")
       - "diente" (no "dientes")
       - "cucharada" (no "cucharadas")
       - "taza" (no "tazas")
       - "pizca" (no "pizcas")
    '''

def get_steps_prompt(ingredients: List[Dict]) -> str:
    ingredient_list = "\n".join([f"{i+1}. {ing['name']} ({ing['quantity']} {ing['unit']})" for i, ing in enumerate(ingredients)])
    
    return f'''Crea los pasos de preparación usando ÚNICAMENTE estos ingredientes numerados:
    {ingredient_list}
    
    Reglas:
    1. Para referirte a un ingrediente usa EXACTAMENTE el formato: "{{quantity_X}} {{ingredient_X}}"
       donde X es el número del ingrediente en la lista anterior
    2. Cada paso debe comenzar con un emoji relevante
    3. Los pasos deben ser claros y concisos
    4. NO menciones ingredientes que no estén en la lista
    5. IMPORTANTE: Usa las llaves {{ }} en el texto, NO intentes evaluar las variables
    
    Ejemplo de formato correcto:
    [
        "🥄 Mezcla {{quantity_1}} {{ingredient_1}} con {{quantity_2}} {{ingredient_2}} en un bol",
        "🔥 Hornea a 180°C durante 30 minutos"
    ]
    
    Ejemplo incorrecto (NO hagas esto):
    [
        "🥄 Mezcla quantity_1 ingredient_1 con quantity_2 ingredient_2",
        "🔥 Hornea quantity_3 ingredient_3"
    ]'''

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