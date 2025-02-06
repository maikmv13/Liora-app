import json
import re
from typing import Dict, List
from openai import OpenAI
from .constants import OPENAI_CONFIG, INGREDIENTS_BY_TYPE
from .formatters import QuantityFormatter
from .units import NUTRITION_UNITS
from .console_utils import print_error, print_progress, print_success
from .prompts import (
    get_recipe_name_prompt,
    get_ingredients_prompt,
    get_steps_prompt,
    get_dietary_info_prompt,
    get_nutrition_prompt
)

class RecipeCreator:
    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_CONFIG['SECRET_KEY'])
        self.formatter = QuantityFormatter()
        
    def clean_json_response(self, content: str) -> str:
        """Limpia la respuesta de la API de marcadores markdown y otros caracteres no deseados"""
        if not content:
            return ""
        
        # Eliminar marcadores de código markdown
        content = re.sub(r'```json\s*', '', content)  # Específicamente para ```json
        content = re.sub(r'```\w*\s*', '', content)   # Para otros lenguajes
        content = re.sub(r'\s*```', '', content)      # Marcador de cierre
        
        # Eliminar comillas extra alrededor del JSON y espacios
        content = content.strip('"').strip()
        
        # Si el contenido parece ser JSON pero tiene caracteres extra al inicio, intentar encontrar el inicio del JSON
        if not content.startswith('{') and not content.startswith('['):
            json_start = content.find('{') if '{' in content else content.find('[')
            if json_start != -1:
                content = content[json_start:]
            
        return content

    def generate_recipe(self, recipe_type: str, max_attempts: int = 3) -> dict:
        """Genera una receta basada en el tipo especificado"""
        for attempt in range(max_attempts):
            try:
                print_progress(f"Intento {attempt + 1} de {max_attempts}")
                
                # Generar nombre y descripción
                print_progress("Generando nombre de la receta...")
                name_response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {"role": "system", "content": "Eres un chef creativo experto en nombres de platos."},
                        {"role": "user", "content": get_recipe_name_prompt(recipe_type)}
                    ],
                    temperature=0.7,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )
                
                print_progress("Nombre completo recibido:")
                print(name_response.choices[0].message.content)
                
                # Parsear nombre y descripción
                name, side_dish, short_description = self.parse_recipe_name(
                    name_response.choices[0].message.content
                )
                
                # 2. Seleccionar ingredientes
                print_progress("Seleccionando ingredientes...")
                ingredients_response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {
                            "role": "system",
                            "content": "Eres un chef experto. Tu tarea es seleccionar ingredientes que correspondan exactamente con la receta solicitada."
                        },
                        {"role": "user", "content": get_ingredients_prompt(
                            recipe_type, 
                            name, 
                            side_dish, 
                            short_description,
                            INGREDIENTS_BY_TYPE
                        )}
                    ],
                    temperature=0.3,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )

                # Validar y limpiar respuesta de ingredientes
                content = self.clean_json_response(ingredients_response.choices[0].message.content)
                print_progress("Respuesta de ingredientes limpia:")
                print(content)

                try:
                    ingredients = json.loads(content)
                    if not isinstance(ingredients, list):
                        raise ValueError("La respuesta no es una lista de ingredientes")
                except json.JSONDecodeError as e:
                    print_error(f"Error al decodificar JSON: {e}")
                    print_error(f"Contenido recibido: {content}")
                    raise ValueError("Formato de ingredientes inválido")

                # Validar estructura de ingredientes
                for ing in ingredients:
                    required_fields = ["name", "quantity", "unit", "category"]
                    missing_fields = [field for field in required_fields if field not in ing]
                    if missing_fields:
                        raise ValueError(f"Ingrediente incompleto. Faltan campos: {missing_fields}")

                # Validar que todos los ingredientes existen
                if not self.validate_ingredients(ingredients):
                    raise ValueError("Ingredientes inválidos detectados")

                # 3. Generar pasos (creatividad media)
                print_progress("Generando pasos de preparación...")
                steps_response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {
                            "role": "system",
                            "content": "Usa ÚNICAMENTE los ingredientes listados y el formato {quantity_X} {ingredient_X}."
                        },
                        {"role": "user", "content": get_steps_prompt(ingredients)}
                    ],
                    temperature=0.7,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )

                # Validar y limpiar respuesta de pasos
                steps_content = self.clean_json_response(steps_response.choices[0].message.content)
                print_progress("Respuesta de pasos limpia:")
                print(steps_content)

                try:
                    steps = json.loads(steps_content)
                except json.JSONDecodeError as e:
                    print_error(f"Error al decodificar JSON de pasos: {e}")
                    print_error(f"Contenido recibido: {steps_content}")
                    raise ValueError("Formato de pasos inválido")

                # Validar que los pasos solo usen ingredientes listados
                if not self.validate_steps_ingredients(steps, ingredients):
                    print(f"Intento {attempt + 1}: Pasos con ingredientes no listados")
                    continue

                # 4. Analizar información dietética (máxima precisión)
                print_progress("Analizando información dietética...")
                dietary_response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {
                            "role": "system",
                            "content": "Eres un experto en nutrición. Analiza con precisión las restricciones dietéticas."
                        },
                        {"role": "user", "content": get_dietary_info_prompt(ingredients)}
                    ],
                    temperature=0.1,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )
                
                dietary_content = self.clean_json_response(dietary_response.choices[0].message.content)
                print_progress("Respuesta dietética recibida:")
                print(dietary_content)
                
                try:
                    dietary_info = self.parse_dietary_info(dietary_content)
                    print_progress("Información dietética parseada:")
                    print(json.dumps(dietary_info, indent=2))
                except Exception as e:
                    print_error(f"Error al procesar información dietética: {e}")
                    print_error(f"Contenido recibido: {dietary_content}")
                    raise ValueError("Formato de información dietética inválido")

                # 5. Calcular información nutricional (máxima precisión)
                print_progress("Calculando información nutricional...")
                nutrition_response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {
                            "role": "system",
                            "content": "Eres un nutricionista experto. Calcula con precisión los valores nutricionales."
                        },
                        {"role": "user", "content": get_nutrition_prompt(ingredients)}
                    ],
                    temperature=0.2,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )
                
                nutrition_content = self.clean_json_response(nutrition_response.choices[0].message.content)
                print_progress("Respuesta nutricional recibida:")
                print(nutrition_content)
                
                try:
                    nutrition_info = self.parse_nutrition_info(nutrition_content)
                    print_progress("Información nutricional parseada:")
                    print(json.dumps(nutrition_info, indent=2))
                except Exception as e:
                    print_error(f"Error al procesar información nutricional: {e}")
                    print_error(f"Contenido recibido: {nutrition_content}")
                    raise ValueError("Formato de información nutricional inválido")

                # 6. Combinar todo en la estructura final
                recipe_data = {
                    "name": name,
                    "side_dish": side_dish,
                    "short_description": short_description,
                    "prep_time": "30 minutos",
                    "cuisine_type": "Internacional",
                    "meal_type": "Comida",
                    "category": recipe_type,
                    "ingredients": ingredients,
                    "steps": steps,
                    "dietary_info": dietary_info,
                    "nutrition_info": nutrition_info
                }

                formatted_recipe = self.format_recipe_for_output(recipe_data)
                if formatted_recipe is None:
                    raise ValueError("Error al formatear la receta")
                return formatted_recipe

            except Exception as e:
                print_error(f"Error en intento {attempt + 1}: {e}")
                if attempt == max_attempts - 1:
                    print_error("Se alcanzó el número máximo de intentos")
                    return None
                print_progress("Reintentando...")
                continue

        return None

    def validate_ingredients(self, ingredients: List[Dict]) -> bool:
        """Verifica que todos los ingredientes existan en el diccionario"""
        # Crear un diccionario invertido para buscar ingredientes y sus categorías
        ingredient_categories = {}
        for category, items in INGREDIENTS_BY_TYPE.items():
            for ingredient in items:
                ingredient_lower = ingredient.lower().strip()
                ingredient_categories[ingredient_lower] = category

        # Validar los ingredientes de la receta
        for ingredient in ingredients:
            name = ingredient["name"].strip()
            name_lower = name.lower()
            category = ingredient.get("category", "")

            if name_lower not in ingredient_categories:
                print(f"\nError: Ingrediente '{name}' no encontrado en ninguna categoría")
                # Buscar ingredientes similares
                similar = [ing for ing in ingredient_categories.keys() if name_lower in ing or ing in name_lower]
                if similar:
                    print("Ingredientes similares disponibles:")
                    for s in similar:
                        print(f"- '{s}' en categoría '{ingredient_categories[s]}'")
                return False

            correct_category = ingredient_categories[name_lower]
            if category != correct_category:
                print(f"\nError: Categoría incorrecta para '{name}'")
                print(f"Categoría recibida: '{category}'")
                print(f"Categoría correcta: '{correct_category}'")
                return False

        return True

    def validate_steps_ingredients(self, steps: List[str], ingredients: List[Dict]) -> bool:
        """Verifica que los pasos solo usen ingredientes listados y en el formato correcto"""
        ingredient_names = {ing["name"].lower() for ing in ingredients}
        
        # Crear un diccionario de sustitución para los marcadores de posición
        replacements = {}
        for i, ing in enumerate(ingredients, 1):
            replacements[f"{{quantity_{i}}}"] = str(ing["quantity"])
            replacements[f"{{ingredient_{i}}}"] = ing["name"].lower()  # Convertir a minúsculas para comparación

        for step in steps:
            try:
                # Convertir el paso a minúsculas para la comparación
                step_text = step.lower()
                
                # Intentar realizar la sustitución de los marcadores de posición
                for key, value in replacements.items():
                    step_text = step_text.replace(key.lower(), value)
                
                # Verificar que no hay ingredientes mencionados fuera de las referencias
                for ingredient_name in ingredient_names:
                    # Ignorar los ingredientes que ya fueron reemplazados correctamente
                    if ingredient_name not in replacements.values() and ingredient_name in step_text:
                        print(f"Ingrediente '{ingredient_name}' mencionado sin formato correcto en el paso: '{step}'")
                        return False
                    
            except KeyError as e:
                print(f"Error en formato de paso: {e}")
                return False

        return True

    def format_recipe_for_output(self, recipe_data: dict) -> dict:
        """Formatea la receta para la salida final"""
        try:
            # Diccionario de conversión de unidades a singular
            unit_to_singular = {
                "unidades": "unidad",
                "dientes": "diente",
                "cucharadas": "cucharada",
                "cucharaditas": "cucharadita",
                "tazas": "taza",
                "pizcas": "pizca",
                "gramos": "gramo",
                "mililitros": "mililitro",
                "kilos": "kilo",
                "litros": "litro",
                "hojas": "hoja",
                "ramitas": "ramita",
                "latas": "lata",
                "paquetes": "paquete",
                "manojos": "manojo",
                "filetes": "filete",
                "medallones": "medallón",
                "rodajas": "rodaja",
                "lonchas": "loncha"
            }

            formatted_recipe = {
                "name": recipe_data["name"].strip(),
                "side_dish": recipe_data["side_dish"].strip(),
                "short_description": recipe_data["short_description"].strip(),
                "prep_time": recipe_data["prep_time"],
                "cuisine_type": recipe_data["cuisine_type"],
                "meal_type": recipe_data["meal_type"],
                "category": recipe_data["category"],
                "ingredients": [
                    {
                        "name": ing["name"].strip(),
                        "quantity": ing["quantity"],
                        "unit": unit_to_singular.get(ing["unit"].strip(), ing["unit"].strip()),
                        "category": ing["category"].strip()
                    }
                    for ing in recipe_data["ingredients"]
                ],
                "steps": [step.strip() for step in recipe_data["steps"]],
                "dietary_info": recipe_data["dietary_info"],
                "nutrition_info": recipe_data["nutrition_info"]
            }
            
            print_success("Receta formateada correctamente")
            return formatted_recipe
            
        except Exception as e:
            print_error(f"Error al formatear la receta: {e}")
            return None

    def parse_dietary_info(self, content: str) -> dict:
        """Convierte la respuesta dietética a formato JSON"""
        try:
            # Primero intentar parsear como JSON
            return json.loads(content)
        except json.JSONDecodeError:
            # Si falla, intentar convertir de YAML a JSON
            try:
                # Convertir el formato YAML a diccionario
                dietary_dict = {}
                for line in content.strip().split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key = key.strip('- ').strip()
                        value = value.strip().upper() == 'TRUE'
                        dietary_dict[key] = value
                return dietary_dict
            except Exception as e:
                print_error(f"Error al parsear información dietética: {e}")
                raise ValueError("Formato de información dietética inválido")

    def parse_nutrition_info(self, content: str) -> dict:
        """Convierte la respuesta nutricional a formato JSON"""
        try:
            # Primero intentar parsear como JSON
            return json.loads(content)
        except json.JSONDecodeError:
            try:
                # Buscar los valores nutricionales en el texto
                nutrition_dict = {
                    "energy_kj": 0,
                    "calories": 0,
                    "fats": 0,
                    "saturated_fats": 0,
                    "carbohydrates": 0,
                    "sugars": 0,
                    "fiber": 0,
                    "proteins": 0
                }
                
                # Patrones para buscar valores
                patterns = {
                    "energy_kj": r"energía:?\s*(\d+\.?\d*)\s*kj",
                    "calories": r"calorías:?\s*(\d+\.?\d*)\s*kcal",
                    "fats": r"grasas totales:?\s*(\d+\.?\d*)g",
                    "saturated_fats": r"grasas saturadas:?\s*(\d+\.?\d*)g",
                    "carbohydrates": r"carbohidratos:?\s*(\d+\.?\d*)g",
                    "sugars": r"azúcares:?\s*(\d+\.?\d*)g",
                    "fiber": r"fibra:?\s*(\d+\.?\d*)g",
                    "proteins": r"proteínas:?\s*(\d+\.?\d*)g"
                }
                
                # Buscar cada valor en el texto
                content_lower = content.lower()
                for key, pattern in patterns.items():
                    match = re.search(pattern, content_lower)
                    if match:
                        nutrition_dict[key] = float(match.group(1))
                
                return nutrition_dict
                
            except Exception as e:
                print_error(f"Error al parsear información nutricional: {e}")
                raise ValueError("Formato de información nutricional inválido")

    def parse_recipe_name(self, content: str) -> tuple:
        """Parsea el nombre de la receta del formato JSON"""
        try:
            # Limpiar la respuesta
            content = self.clean_json_response(content)
            
            # Parsear el JSON
            recipe_data = json.loads(content)
            
            # Extraer los campos
            name = recipe_data.get('name', '').strip()
            side_dish = recipe_data.get('side_dish', '').strip()
            short_description = recipe_data.get('short_description', '').strip()
            
            # Validar que tenemos todos los campos necesarios
            if not all([name, side_dish, short_description]):
                raise ValueError("Faltan campos requeridos en la respuesta")
            
            print_success(f"Nombre del plato: {name}")
            print_success(f"Acompañamiento: {side_dish}")
            
            return name, side_dish, short_description
            
        except json.JSONDecodeError:
            print_error("Error al decodificar JSON del nombre de la receta")
            raise ValueError("Formato de nombre inválido")
        except Exception as e:
            print_error(f"Error al parsear nombre de receta: {e}")
            raise ValueError(f"Formato de nombre inválido: {content}")