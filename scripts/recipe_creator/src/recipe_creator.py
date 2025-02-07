import json
import re
from typing import Dict, List
from openai import OpenAI
from .constants import (
    OPENAI_CONFIG, 
    INGREDIENTS_BY_TYPE, 
    INGREDIENT_ALIASES,
    RECIPE_CATEGORIES,
    clean_ingredients_list
)
from .formatters import QuantityFormatter
from .units import NUTRITION_UNITS
from .console_utils import print_error, print_progress, print_success
from .prompts import (
    get_recipe_name_prompt,
    get_ingredients_prompt,
    get_steps_prompt,
    get_dietary_info_prompt,
    get_nutrition_prompt,
    get_image_prompt
)
from difflib import get_close_matches, SequenceMatcher
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import io
import slugify

class RecipeCreator:
    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_CONFIG['SECRET_KEY'])
        self.formatter = QuantityFormatter()
        self.base_image_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "recipes_images")
        self._ensure_image_directories()
        
        # Limpiar duplicados en las listas de ingredientes
        clean_ingredients_list()
        
    def _ensure_image_directories(self):
        """Asegura que existan los directorios necesarios para las imágenes"""
        # Crear directorio base si no existe
        if not os.path.exists(self.base_image_path):
            os.makedirs(self.base_image_path)
            
        # Crear directorios por categoría y subcategoría
        for category, subcategories in RECIPE_CATEGORIES.items():
            # Crear directorio de categoría principal
            category_path = os.path.join(
                self.base_image_path, 
                category.lower().replace(' ', '_')
            )
            if not os.path.exists(category_path):
                os.makedirs(category_path)
                
            # Crear directorios para subcategorías
            for subcategory in subcategories:
                subcategory_path = os.path.join(
                    category_path,
                    subcategory.lower().replace(' ', '_')
                )
                if not os.path.exists(subcategory_path):
                    os.makedirs(subcategory_path)

    def _get_image_path(self, recipe_type: str, recipe_name: str, side_dish: str) -> dict:
        """Genera las rutas para guardar las imágenes de la receta"""
        # Crear slug SEO-friendly
        recipe_slug = slugify.slugify(f"{recipe_name}-{side_dish}", separator='-')
        
        # Generar timestamp
        timestamp = datetime.now().strftime('%Y%m%d')
        
        # Encontrar la categoría principal
        main_category = None
        subcategory = recipe_type
        
        for category, subcategories in RECIPE_CATEGORIES.items():
            if recipe_type in subcategories:
                main_category = category
                break
        
        if not main_category:
            main_category = "otros"
        
        # Crear rutas para diferentes tamaños
        base_path = os.path.join(
            self.base_image_path,
            main_category.lower().replace(' ', '_'),
            subcategory.lower().replace(' ', '_')
        )
        
        # Asegurar que el directorio existe
        if not os.path.exists(base_path):
            os.makedirs(base_path)
        
        # Generar rutas para diferentes tamaños
        image_paths = {
            'original': os.path.join(base_path, f"{recipe_slug}-{timestamp}.webp"),
            'mobile': os.path.join(base_path, f"{recipe_slug}-mobile-{timestamp}.webp"),
            'thumbnail': os.path.join(base_path, f"{recipe_slug}-thumb-{timestamp}.webp")
        }
        
        return image_paths

    def generate_recipe_image(self, recipe_type: str, name: str, side_dish: str, short_description: str) -> dict:
        """Genera y guarda una imagen para la receta usando DALL-E 3"""
        try:
            print_progress("Generando imagen de la receta con DALL-E 3...")
            
            # Generar imagen con DALL-E 3
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=get_image_prompt(name, side_dish),  # Ya no usamos short_description
                size="1024x1024",
                quality="standard",
                style="natural",
                n=1,
            )
            
            # Obtener la URL de la imagen
            image_url = response.data[0].url
            
            # Descargar la imagen
            import requests
            image_data = requests.get(image_url).content
            
            # Convertir a objeto PIL
            image = Image.open(io.BytesIO(image_data))
            
            # Redimensionar a 16:9
            aspect_ratio = 16/9
            target_width = 854  # Ancho base para versión mobile
            target_height = int(target_width / aspect_ratio)
            
            # Recortar la imagen cuadrada al aspect ratio 16:9
            current_ratio = image.width / image.height
            if current_ratio > aspect_ratio:
                new_width = int(image.height * aspect_ratio)
                left = (image.width - new_width) // 2
                image = image.crop((left, 0, left + new_width, image.height))
            else:
                new_height = int(image.width / aspect_ratio)
                top = (image.height - new_height) // 2
                image = image.crop((0, top, image.width, top + new_height))
            
            # Redimensionar a las dimensiones objetivo
            image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
            
            # Añadir marca de agua
            image = self.add_watermark(image)
            
            # Obtener rutas para diferentes tamaños
            image_paths = self._get_image_path(recipe_type, name, side_dish)
            
            # Ajustar tamaños manteniendo proporción 16:9
            image_sizes = {
                'original': (854, 480),    # 16:9 480p
                'mobile': (640, 360),      # 16:9 360p
                'thumbnail': (426, 240)    # 16:9 240p
            }
            
            # Guardar diferentes versiones
            for size_name, dimensions in image_sizes.items():
                resized = image.resize(dimensions, Image.Resampling.LANCZOS)
                resized.save(image_paths[size_name], 'WEBP', quality=85)
            
            print_success(f"Imágenes guardadas en: {image_paths['mobile']}")
            
            # Retornar diccionario con las rutas y metadatos
            return {
                'urls': image_paths,
                'metadata': {
                    'recipe_name': name,
                    'recipe_type': recipe_type,
                    'side_dish': side_dish,
                    'created_at': datetime.now().isoformat(),
                    'sizes': {
                        'original': '854x480',
                        'mobile': '640x360',
                        'thumbnail': '426x240'
                    },
                    'format': 'webp',
                    'aspect_ratio': '16:9'
                }
            }
            
        except Exception as e:
            print_error(f"Error al generar imagen con DALL-E 3: {e}")
            return None

    def clean_json_response(self, content: str) -> str:
        """Limpia la respuesta de la API de caracteres no deseados"""
        if not content:
            return ""
        
        # Eliminar marcadores de código markdown
        content = re.sub(r'```json\s*', '', content)
        content = re.sub(r'```\w*\s*', '', content)
        content = re.sub(r'\s*```', '', content)
        
        # Eliminar caracteres de control y espacios extra
        content = ''.join(char for char in content if ord(char) >= 32 or char == '\n')
        content = re.sub(r'\s+', ' ', content)
        
        # Limpiar caracteres especiales alrededor del JSON
        content = content.strip('"').strip()
        
        # Si el contenido parece ser JSON pero tiene caracteres extra al inicio
        if not content.startswith('{') and not content.startswith('['):
            json_start = content.find('{') if '{' in content else content.find('[')
            if json_start != -1:
                content = content[json_start:]
        
        # Asegurar que las comillas son correctas
        content = content.replace('"', '"').replace('"', '"')
        
        # Escapar caracteres especiales dentro de strings
        content = re.sub(r'(?<!\\)\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})', r'\\\\', content)
        
        return content

    def generate_recipe(self, recipe_type: str, generate_images: bool = True, max_retries: int = 3) -> Dict:
        """Genera una receta completa"""
        for attempt in range(max_retries):
            try:
                print_progress(f"\nGenerando receta {attempt + 1} de {max_retries}...")
                
                # 1. Generar nombre y descripción
                name_response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {"role": "system", "content": "Eres un chef creativo experto en nombres de platos."},
                        {"role": "user", "content": get_recipe_name_prompt(recipe_type)}
                    ],
                    temperature=0.7,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )
                
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
                            "content": "Eres un chef experto. Selecciona ingredientes precisos."
                        },
                        {"role": "user", "content": get_ingredients_prompt(
                            recipe_type, name, side_dish, short_description, INGREDIENTS_BY_TYPE
                        )}
                    ],
                    temperature=0.3,
                    max_tokens=OPENAI_CONFIG['MAX_TOKENS']
                )
                
                # Validar y limpiar respuesta de ingredientes
                content = self.clean_json_response(ingredients_response.choices[0].message.content)
                ingredients = json.loads(content)
                
                # Validar ingredientes
                if not self.validate_ingredients(ingredients):
                    raise ValueError("Ingredientes inválidos detectados")
                
                # 3. Generar pasos
                steps = self.generate_recipe_steps(ingredients)
                if not steps:
                    raise ValueError("No se pudieron generar los pasos de la receta")
                
                # 4. Generar información dietética
                dietary_info = self.generate_dietary_info(ingredients)
                if not dietary_info:
                    raise ValueError("No se pudo generar la información dietética")
                
                # 5. Generar información nutricional
                nutrition_info = self.generate_nutrition_info(ingredients)
                if not nutrition_info:
                    raise ValueError("No se pudo generar la información nutricional")
                
                # 6. Generar imagen solo si se solicita
                image_paths = None
                if generate_images:
                    image_paths = self.generate_recipe_image(recipe_type, name, side_dish, short_description)
                    if not image_paths:
                        raise ValueError("No se pudo generar la imagen de la receta")
                
                # 7. Formatear receta completa
                recipe = self.format_recipe(
                    recipe_type=recipe_type,
                    name=name,
                    side_dish=side_dish,
                    short_description=short_description,
                    ingredients=ingredients,
                    steps=steps,
                    dietary_info=dietary_info,
                    nutrition_info=nutrition_info,
                    image_paths=image_paths
                )
                
                if recipe:
                    return recipe
                else:
                    raise ValueError("Error al formatear la receta")
                
            except Exception as e:
                print_error(f"Error en intento {attempt + 1}: {str(e)}")
                if attempt < max_retries - 1:
                    print_progress("Reintentando...")
                
        return None

    def normalize_ingredient(self, ingredient_name: str) -> str:
        """Normaliza el nombre del ingrediente usando aliases y reglas básicas"""
        try:
            # Convertir a minúsculas
            normalized = ingredient_name.lower()
            
            # Eliminar palabras de preparación comunes
            prep_words = [
                'rallado', 'picado', 'cortado', 'troceado', 'molido',
                'en rodajas', 'en trozos', 'en dados', 'en juliana',
                'fresco', 'fresca', 'frescos', 'frescas'
            ]
            
            # Dividir el nombre en palabras
            words = normalized.split()
            
            # Filtrar palabras de preparación
            main_words = [word for word in words if word not in prep_words]
            
            # Reconstruir el nombre principal
            normalized = ' '.join(main_words)
            
            # Eliminar plurales básicos
            if normalized.endswith('s') and not normalized.endswith('as'):
                normalized = normalized[:-1]
            
            # Buscar en aliases
            if normalized in INGREDIENT_ALIASES:
                normalized = INGREDIENT_ALIASES[normalized]
            else:
                # Si no encuentra coincidencia exacta, buscar coincidencias parciales
                for alias, value in INGREDIENT_ALIASES.items():
                    if normalized in alias or alias in normalized:
                        normalized = value
                        break
            
            # Eliminar prefijos comunes
            for prefix in ['rodajas de ', 'filetes de ', 'trozos de ', 'picado de ', 'rallado de ']:
                if normalized.startswith(prefix):
                    normalized = normalized[len(prefix):]
            
            return normalized.capitalize()
            
        except Exception as e:
            print_error(f"Error normalizando ingrediente '{ingredient_name}': {e}")
            return ingredient_name

    def validate_ingredients(self, ingredients: List[Dict]) -> bool:
        """Valida los ingredientes y autocorrige cuando es posible"""
        try:
            for ing in ingredients:
                normalized_name = self.normalize_ingredient(ing['name'])
                found = False
                
                # Buscar en la categoría especificada
                if 'category' in ing:
                    if normalized_name in INGREDIENTS_BY_TYPE.get(ing['category'], []):
                        ing['name'] = normalized_name
                        found = True
                    else:
                        # Buscar similares en la misma categoría
                        similar = self.find_similar_ingredients(
                            normalized_name, 
                            category=ing['category'],
                            n=1
                        )
                        if similar and similar[0]['similarity'] >= 0.8:
                            print_progress(
                                f"Autocorrigiendo '{ing['name']}' a '{similar[0]['name']}' "
                                f"(similitud: {similar[0]['similarity']:.2f})"
                            )
                            ing['name'] = similar[0]['name']
                            found = True
                
                if not found:
                    # Consultar al modelo para categorización
                    print_progress(f"Ingrediente '{ing['name']}' no encontrado. Consultando categorización...")
                    categorization = self.get_ingredient_categorization(ing['name'])
                    
                    if categorization:
                        print_progress("\n¿Deseas usar esta categorización? (s/n): ")
                        if input().lower().strip() == 's':
                            ing['name'] = categorization['name']
                            ing['category'] = categorization['category']
                            
                            # Añadir a los diccionarios para uso futuro
                            INGREDIENTS_BY_TYPE[categorization['category']].append(categorization['name'])
                            for alias in categorization['aliases']:
                                INGREDIENT_ALIASES[alias] = categorization['name']
                            
                            # Guardar cambios
                            self._save_ingredients_to_file()
                            found = True
                            print_success(f"Ingrediente '{ing['name']}' añadido a la categoría '{ing['category']}'")
                    
                    if not found:
                        print_error(f"No se pudo validar el ingrediente: {ing['name']}")
                        return False
            
            return True
            
        except Exception as e:
            print_error(f"Error en validación de ingredientes: {e}")
            return False

    def validate_steps_ingredients(self, steps: List[str], ingredients: List[Dict]) -> bool:
        """Verifica que los pasos solo usen ingredientes listados y en el formato correcto"""
        try:
            # Verificar que cada paso es un string
            if not all(isinstance(step, str) for step in steps):
                print_error("Todos los pasos deben ser texto")
                return False

            # Crear patrones de variables esperados
            expected_patterns = []
            for i in range(1, len(ingredients) + 1):
                expected_patterns.extend([
                    f"{{quantity_{i}}}",
                    f"{{unit_{i}}}",
                    f"{{ingredient_{i}}}"
                ])

            corrected_steps = []
            for step in steps:
                corrected_step = step
                
                # Verificar que todas las variables están correctamente formateadas
                for i in range(1, len(ingredients) + 1):
                    patterns = [
                        f"{{quantity_{i}}}",
                        f"{{unit_{i}}}",
                        f"{{ingredient_{i}}}"
                    ]
                    
                    # Si se usa alguna variable de este ingrediente, verificar que se usen todas
                    if any(pattern in step for pattern in patterns):
                        if not all(pattern in step for pattern in patterns):
                            print_progress(f"Corrigiendo paso: {step}")
                            
                            # Encontrar la primera variable presente
                            for pattern in patterns:
                                if pattern in step:
                                    pos = step.find(pattern)
                                    # Insertar las variables faltantes
                                    for missing in patterns:
                                        if missing not in step:
                                            corrected_step = (
                                                corrected_step[:pos] + 
                                                f"{missing} " + 
                                                corrected_step[pos:]
                                            )
                                    break
                            
                            print_progress(f"Paso corregido: {corrected_step}")

                # Verificar que solo se usen variables válidas
                found_vars = re.findall(r'{[^}]+}', corrected_step)
                for var in found_vars:
                    if var not in expected_patterns:
                        print_error(f"Variable no válida encontrada: {var}")
                        return False

                corrected_steps.append(corrected_step)

            # Actualizar los pasos con las versiones corregidas
            steps[:] = corrected_steps
            return True
            
        except Exception as e:
            print_error(f"Error en validación de pasos: {e}")
            return False

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
                "images": {
                    "urls": {
                        "original": recipe_data["images"]["urls"]["original"],
                        "mobile": recipe_data["images"]["urls"]["mobile"],
                        "thumbnail": recipe_data["images"]["urls"]["thumbnail"]
                    },
                    "metadata": recipe_data["images"]["metadata"]
                },
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

    def find_similar_ingredients(self, ingredient_name: str, category: str = None, n=3) -> List[Dict]:
        """Encuentra ingredientes similares usando fuzzy matching"""
        try:
            # Si se especifica categoría, buscar solo en esa categoría
            if category:
                if category not in INGREDIENTS_BY_TYPE:
                    print_error(f"Categoría '{category}' no existe")
                    return []
                ingredients = [(item, category) for item in INGREDIENTS_BY_TYPE[category]]
            else:
                # Si no, buscar en todas las categorías
                ingredients = []
                for cat, items in INGREDIENTS_BY_TYPE.items():
                    ingredients.extend([(item, cat) for item in items])
            
            # Obtener nombres similares
            ingredient_names = [item[0] for item in ingredients]
            
            # Usar SequenceMatcher para obtener similitudes más precisas
            similarities = []
            for name in ingredient_names:
                ratio = SequenceMatcher(None, ingredient_name.lower(), name.lower()).ratio()
                if ratio >= 0.8:  # Aumentar el umbral de similitud
                    similarities.append((name, ratio))
            
            # Ordenar por similitud y tomar los N más similares
            similarities.sort(key=lambda x: x[1], reverse=True)
            matches = [s[0] for s in similarities[:n]]
            
            # Retornar matches con sus categorías
            return [
                {
                    'name': match,
                    'category': next(cat for name, cat in ingredients if name == match),
                    'similarity': next(s[1] for s in similarities if s[0] == match)
                }
                for match in matches
            ]
        
        except Exception as e:
            print_error(f"Error al buscar ingredientes similares: {e}")
            return []

    def auto_correct_ingredients(self, ingredients: List[Dict]) -> List[Dict]:
        """Intenta corregir automáticamente ingredientes inválidos"""
        corrected = []
        for ing in ingredients:
            normalized_name = self.normalize_ingredient(ing['name'])
            found = False
            
            # Buscar el ingrediente normalizado
            for category, items in INGREDIENTS_BY_TYPE.items():
                if normalized_name in items:
                    ing['name'] = normalized_name
                    ing['category'] = category
                    found = True
                    corrected.append(ing)
                    break
                
            if not found:
                # Buscar alternativas similares
                similar = self.find_similar_ingredients(normalized_name, n=1)
                if similar:
                    ing['name'] = similar[0]['name']
                    ing['category'] = similar[0]['category']
                    corrected.append(ing)
        
        return corrected

    def clean_ingredients_response(self, content: str) -> str:
        """Intenta limpiar y convertir respuestas mal formateadas a JSON válido"""
        try:
            # Si ya es JSON válido, retornarlo
            json.loads(content)
            return content
        except json.JSONDecodeError:
            ingredients = []
            # Buscar patrones comunes en texto
            lines = content.split('\n')
            current_category = None
            
            for line in lines:
                line = line.strip()
                # Ignorar líneas vacías y encabezados
                if not line or 'ingredientes para' in line.lower():
                    continue
                    
                # Buscar ingredientes en formato lista
                if line.startswith('-') or line.startswith('*'):
                    ingredient = line.lstrip('- *').strip()
                    # Intentar extraer cantidad y unidad si están presentes
                    parts = ingredient.split('(')[0].strip().split()
                    if len(parts) >= 1:
                        name = parts[-1]
                        quantity = 1
                        unit = "unidad"
                        # Buscar la categoría correcta
                        category = self.find_ingredient_category(name)
                        if category:
                            ingredients.append({
                                "name": name,
                                "quantity": quantity,
                                "unit": unit,
                                "category": category
                            })
            
            if ingredients:
                return json.dumps(ingredients)
            raise ValueError("No se pudieron extraer ingredientes del texto")

    def find_ingredient_category(self, ingredient_name: str) -> str:
        """Busca la categoría correcta para un ingrediente"""
        normalized_name = self.normalize_ingredient(ingredient_name)
        for category, items in INGREDIENTS_BY_TYPE.items():
            if normalized_name in items:
                return category
        return None

    def generate_recipe_from_name(self, name: str, side_dish: str) -> dict:
        """Genera una receta a partir de un nombre y acompañamiento dados"""
        try:
            # Determinar el tipo de receta basado en los ingredientes principales
            recipe_type = self._infer_recipe_type(name, side_dish)
            print_success(f"Tipo de receta inferido: {recipe_type}")
            
            # Generar descripción
            description_response = self.client.chat.completions.create(
                model=OPENAI_CONFIG['MODEL'],
                messages=[
                    {
                        "role": "system",
                        "content": "Genera una descripción técnica y precisa para esta receta."
                    },
                    {
                        "role": "user",
                        "content": f"Crea una descripción técnica para: {name} {side_dish}\n"
                                  f"Incluye:\n"
                                  f"- Método exacto de cocción y temperatura/tiempo\n"
                                  f"- Técnicas culinarias utilizadas\n"
                                  f"- Resultado final esperado"
                    }
                ],
                temperature=0.7,
                max_tokens=OPENAI_CONFIG['MAX_TOKENS']
            )
            
            short_description = description_response.choices[0].message.content.strip()
            print_success("Descripción generada")
            
            # Continuar con el proceso normal de generación
            recipe_data = {
                "name": name,
                "side_dish": side_dish,
                "short_description": short_description
            }
            
            return self.generate_recipe(recipe_type, recipe_data=recipe_data)
            
        except Exception as e:
            print_error(f"Error al generar receta desde nombre: {e}")
            return None

    def _infer_recipe_type(self, name: str, side_dish: str) -> str:
        """Infiere el tipo de receta basado en el nombre y acompañamiento"""
        prompt = f"""Determina la categoría más apropiada para esta receta:
        Nombre: {name}
        Acompañamiento: {side_dish}
        
        Categorías disponibles:
        {json.dumps(RECIPE_CATEGORIES, indent=2, ensure_ascii=False)}
        
        Responde ÚNICAMENTE con el nombre exacto de la subcategoría más apropiada."""
        
        response = self.client.chat.completions.create(
            model=OPENAI_CONFIG['MODEL'],
            messages=[
                {
                    "role": "system",
                    "content": "Eres un experto en categorización de recetas."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=50
        )
        
        recipe_type = response.choices[0].message.content.strip()
        print_progress(f"Categoría inferida: {recipe_type}")
        return recipe_type

    def add_watermark(self, image: Image, text: str = "liora.app") -> Image:
        """Añade una marca de agua sutil a la imagen"""
        # Crear una copia de la imagen
        img_with_watermark = image.copy()
        
        # Crear el objeto Draw
        draw = ImageDraw.Draw(img_with_watermark)
        
        # Intentar cargar una fuente bonita, si no está disponible usar default
        try:
            # Ajustar el tamaño de la fuente según el tamaño de la imagen
            font_size = int(image.width * 0.02)  # 2% del ancho de la imagen
            font = ImageFont.truetype("Arial", font_size)
        except:
            font = ImageFont.load_default()
        
        # Obtener el tamaño del texto
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        # Posición del texto (esquina inferior derecha)
        x = image.width - text_width - 20
        y = image.height - text_height - 20
        
        # Añadir sombra sutil para legibilidad
        shadow_offset = 2
        draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=(0, 0, 0, 100))
        
        # Añadir texto principal
        draw.text((x, y), text, font=font, fill=(255, 255, 255, 200))
        
        return img_with_watermark

    def get_ingredient_categorization(self, ingredient_name: str) -> Dict:
        """Consulta al modelo para categorizar un nuevo ingrediente"""
        try:
            prompt = f'''Categoriza este ingrediente en una de las categorías existentes:

            Ingrediente: "{ingredient_name}"

            INSTRUCCIONES:
            1. Usa ÚNICAMENTE una de estas categorías existentes:
            {json.dumps(list(INGREDIENTS_BY_TYPE.keys()), indent=2, ensure_ascii=False)}

            2. Reglas específicas:
            - Todos los tipos de pasta van en la categoría "Pastas"
            - Las harinas y masas van en "Harinas y Masas"
            - Los panes van en "Panes Tradicionales"
            - Las verduras van en sus categorías específicas

            3. Responde SOLO con este formato JSON:
            {{
                "name": "nombre en singular",
                "category": "categoría de la lista",
                "aliases": ["variante1", "variante2"]
            }}

            Ejemplos:
            - Para "spaghetti": {{"name": "Espagueti", "category": "Pastas", "aliases": ["spaghetti", "pasta larga"]}}
            - Para "harina": {{"name": "Harina de fuerza", "category": "Harinas y Masas", "aliases": ["harina común"]}}
            '''

            response = self.client.chat.completions.create(
                model=OPENAI_CONFIG['MODEL'],
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en clasificación de ingredientes culinarios. "
                                  "Categoriza cada ingrediente en su categoría más específica."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=150
            )

            content = self.clean_json_response(response.choices[0].message.content)
            categorization = json.loads(content)

            # Validaciones específicas
            if "pasta" in ingredient_name.lower() and categorization["category"] != "Pastas":
                print_error(f"Error: Los tipos de pasta deben ir en la categoría 'Pastas'")
                return None

            print_progress(f"Categorización sugerida para '{ingredient_name}':")
            print_progress(f"- Nombre: {categorization['name']}")
            print_progress(f"- Categoría: {categorization['category']}")

            return categorization

        except Exception as e:
            print_error(f"Error al categorizar ingrediente: {e}")
            return None

    def suggest_new_ingredient(self, ingredient_name: str) -> Dict:
        """Sugiere la categoría y formato correcto para un nuevo ingrediente"""
        try:
            prompt = f'''Analiza este ingrediente y sugiere la mejor categoría para incluirlo:

            Ingrediente: "{ingredient_name}"
            
            IMPORTANTE:
            1. Mantén el nombre original si es un ingrediente válido
            2. NO sugieras cambios drásticos (ej: no cambies "pasta" por "patata")
            3. Solo normaliza el formato y corrige errores obvios
            4. Si es un ingrediente nuevo, súmalo a la categoría más apropiada
            
            Categorías disponibles:
            {json.dumps(INGREDIENTS_BY_TYPE, indent=2, ensure_ascii=False)}
            
            Responde en formato JSON con:
            1. El nombre normalizado (manteniendo la esencia del ingrediente original)
            2. La categoría más apropiada de las existentes
            3. Posibles aliases o variantes comunes
            
            Ejemplo de respuesta:
            {{
                "name": "espagueti",
                "category": "Pastas y Fideos",
                "aliases": ["spaghetti", "espaguetis", "pasta larga"]
            }}
            '''
            
            response = self.client.chat.completions.create(
                model=OPENAI_CONFIG['MODEL'],
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en categorización de ingredientes culinarios. Tu objetivo es mantener la integridad del ingrediente original."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=150
            )
            
            content = self.clean_json_response(response.choices[0].message.content)
            suggestion = json.loads(content)
            
            # Validar que la sugerencia no cambia drásticamente el ingrediente
            if not self._is_valid_suggestion(ingredient_name, suggestion["name"]):
                print_error(f"Sugerencia inválida: '{suggestion['name']}' es muy diferente de '{ingredient_name}'")
                return None
            
            return suggestion
            
        except Exception as e:
            print_error(f"Error al sugerir categoría para nuevo ingrediente: {e}")
            return None

    def _is_valid_suggestion(self, original: str, suggestion: str) -> bool:
        """Verifica que la sugerencia no cambia drásticamente el ingrediente original"""
        # Normalizar ambos strings
        original = original.lower().strip()
        suggestion = suggestion.lower().strip()
        
        # Si son iguales o muy similares, es válido
        if original == suggestion or original in suggestion or suggestion in original:
            return True
        
        # Calcular similitud usando distancia de Levenshtein
        similarity = SequenceMatcher(None, original, suggestion).ratio()
        
        # Si la similitud es menor a 0.6, considerar inválido
        return similarity >= 0.6

    def add_new_ingredient(self, ingredient_data: Dict) -> bool:
        """Añade un nuevo ingrediente al diccionario de ingredientes"""
        try:
            # Validar que tenemos todos los campos necesarios
            required_fields = ["name", "category", "aliases"]
            if not all(field in ingredient_data for field in required_fields):
                print_error("Faltan campos requeridos en los datos del ingrediente")
                return False
            
            # Verificar que la categoría existe
            if ingredient_data["category"] not in INGREDIENTS_BY_TYPE:
                print_error(f"La categoría {ingredient_data['category']} no existe")
                return False
            
            # Añadir el ingrediente y sus aliases
            INGREDIENTS_BY_TYPE[ingredient_data["category"]].append(ingredient_data["name"])
            for alias in ingredient_data["aliases"]:
                INGREDIENT_ALIASES[alias] = ingredient_data["name"]
            
            # Guardar los cambios en el archivo de constantes
            self._save_ingredients_to_file()
            
            print_success(f"Ingrediente '{ingredient_data['name']}' añadido a la categoría '{ingredient_data['category']}'")
            return True
            
        except Exception as e:
            print_error(f"Error al añadir nuevo ingrediente: {e}")
            return False

    def _save_ingredients_to_file(self):
        """Guarda los diccionarios actualizados en el archivo de constantes"""
        try:
            constants_path = os.path.join(os.path.dirname(__file__), 'constants.py')
            
            with open(constants_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Encontrar y actualizar las secciones relevantes
            with open(constants_path, 'w', encoding='utf-8') as f:
                in_ingredients = False
                in_aliases = False
                
                for line in lines:
                    if line.startswith('INGREDIENTS_BY_TYPE = {'):
                        f.write('INGREDIENTS_BY_TYPE = ' + json.dumps(INGREDIENTS_BY_TYPE, indent=4, ensure_ascii=False) + '\n')
                        in_ingredients = True
                    elif line.startswith('INGREDIENT_ALIASES = {'):
                        f.write('INGREDIENT_ALIASES = ' + json.dumps(INGREDIENT_ALIASES, indent=4, ensure_ascii=False) + '\n')
                        in_aliases = True
                    elif not in_ingredients and not in_aliases:
                        f.write(line)
                    elif line.strip() == '}':
                        in_ingredients = False
                        in_aliases = False
            
            print_success("Diccionarios de ingredientes actualizados correctamente")
            
        except Exception as e:
            print_error(f"Error al guardar los diccionarios: {e}")

    def generate_recipe_steps(self, ingredients: List[Dict], max_retries: int = 3) -> List[str]:
        """Genera los pasos de la receta"""
        for attempt in range(max_retries):
            try:
                print_progress("Generando pasos de preparación...")
                
                response = self.client.chat.completions.create(
                    model=OPENAI_CONFIG['MODEL'],
                    messages=[
                        {
                            "role": "system",
                            "content": "Eres un chef experto. Genera pasos de recetas manteniendo las variables como texto literal."
                        },
                        {
                            "role": "user", 
                            "content": get_steps_prompt(ingredients)
                        }
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                
                # Limpiar y validar la respuesta
                content = self.clean_json_response(response.choices[0].message.content)
                
                try:
                    # Intentar parsear como JSON directamente
                    steps = json.loads(content)
                except json.JSONDecodeError:
                    # Si falla, intentar extraer la lista de pasos del texto
                    steps = []
                    for line in content.split('\n'):
                        line = line.strip()
                        if line.startswith('"') or line.startswith('"'):
                            # Limpiar el paso y añadirlo
                            step = line.strip('",')
                            steps.append(step)
                
                # Validar que tenemos pasos válidos
                if not steps or not all(isinstance(step, str) for step in steps):
                    raise ValueError("No se obtuvieron pasos válidos")
                
                # Validar y corregir el formato de las variables
                if self.validate_steps_ingredients(steps, ingredients):
                    return steps
                    
            except Exception as e:
                print_error(f"Error en intento {attempt + 1}: {str(e)}")
                if attempt < max_retries - 1:
                    print_progress("Reintentando...")
                    
        return None

    def format_recipe(self, recipe_type: str, name: str, side_dish: str, short_description: str, 
                     ingredients: List[Dict], steps: List[str], 
                     dietary_info: Dict, nutrition_info: Dict, 
                     image_paths: Dict = None) -> Dict:
        """Formatea la receta en un diccionario estructurado"""
        try:
            # Validar datos requeridos (sin incluir image_paths)
            required_data = [name, side_dish, short_description, ingredients, steps, 
                            dietary_info, nutrition_info]
            if not all(required_data):
                raise ValueError("Faltan datos requeridos para formatear la receta")
            
            recipe = {
                "recipe_type": recipe_type,
                "name": name,
                "side_dish": side_dish,
                "short_description": short_description,
                "ingredients": ingredients,
                "steps": steps,
                "dietary_info": dietary_info,
                "nutrition_info": nutrition_info,
                "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # Añadir imágenes solo si están disponibles
            if image_paths:
                recipe["image_paths"] = image_paths
            
            return recipe
            
        except Exception as e:
            print_error(f"Error al formatear la receta: {str(e)}")
            return None

    def generate_dietary_info(self, ingredients: List[Dict]) -> Dict:
        """Genera información dietética basada en los ingredientes"""
        try:
            print_progress("Generando información dietética...")
            
            response = self.client.chat.completions.create(
                model=OPENAI_CONFIG['MODEL'],
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en nutrición. Analiza los ingredientes y determina las restricciones dietéticas."
                    },
                    {
                        "role": "user", 
                        "content": get_dietary_info_prompt(ingredients)
                    }
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            # Limpiar y validar la respuesta
            content = self.clean_json_response(response.choices[0].message.content)
            dietary_info = json.loads(content)
            
            # Validar que tenemos todos los campos requeridos
            required_fields = [
                "gluten_free", "lactose_free", "nut_free", "egg_free",
                "shellfish_free", "soy_free", "yeast_free", "sugar_free",
                "vegan", "vegetarian", "keto", "paleo"
            ]
            
            if not all(field in dietary_info for field in required_fields):
                raise ValueError("Faltan campos requeridos en la información dietética")
            
            # Asegurar que todos los valores son booleanos
            for key in dietary_info:
                if not isinstance(dietary_info[key], bool):
                    dietary_info[key] = dietary_info[key].lower() == 'true'
            
            return dietary_info
            
        except Exception as e:
            print_error(f"Error al generar información dietética: {e}")
            return None

    def generate_nutrition_info(self, ingredients: List[Dict]) -> Dict:
        """Genera información nutricional basada en los ingredientes"""
        try:
            print_progress("Generando información nutricional...")
            
            response = self.client.chat.completions.create(
                model=OPENAI_CONFIG['MODEL'],
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en nutrición. Calcula los valores nutricionales precisos."
                    },
                    {
                        "role": "user", 
                        "content": get_nutrition_prompt(ingredients)
                    }
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            # Limpiar y validar la respuesta
            content = self.clean_json_response(response.choices[0].message.content)
            nutrition_info = json.loads(content)
            
            # Validar que tenemos todos los campos requeridos
            required_fields = [
                "energy_kj", "calories", "fats", "saturated_fats",
                "carbohydrates", "sugars", "fiber", "proteins"
            ]
            
            if not all(field in nutrition_info for field in required_fields):
                raise ValueError("Faltan campos requeridos en la información nutricional")
            
            # Asegurar que todos los valores son numéricos
            for key in nutrition_info:
                if not isinstance(nutrition_info[key], (int, float)):
                    nutrition_info[key] = float(str(nutrition_info[key]).replace(',', '.'))
            
            return nutrition_info
            
        except Exception as e:
            print_error(f"Error al generar información nutricional: {e}")
            return None