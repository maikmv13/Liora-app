from tqdm import tqdm
import csv
import json
import re
import os

def parse_cantidad(cantidad):
    match = re.match(r"([\d\.\/]+)\s*(\D*)", cantidad)
    if match:
        numero, unidad = match.groups()
        try:
            if '/' in numero:
                numero = eval(numero)
            else:
                numero = float(numero) if '.' in numero else int(numero)
        except ValueError:
            return cantidad, "unidad"
        
        # Mapear unidades al enum
        unit_mapping = {
            'g': 'gramo',
            'gr': 'gramo',
            'gramo': 'gramo',
            'gramos': 'gramo',
            'ml': 'mililitro',
            'mililitro': 'mililitro',
            'mililitros': 'mililitro',
            'unidad': 'unidad',
            'unidades': 'unidad',
            'ud': 'unidad',
            'uds': 'unidad',
            'cucharadita': 'cucharadita',
            'cucharaditas': 'cucharadita',
            'cucharada': 'cucharada',
            'cucharadas': 'cucharada',
            'sobre': 'sobre',
            'sobres': 'sobre',
            'rebanada': 'rebanada',
            'rebanadas': 'rebanada',
            'vaso': 'vaso',
            'vasos': 'vaso',
            'pizca': 'pizca',
            'pizcas': 'pizca',
            'litro': 'litro',
            'litros': 'litro',
            'l': 'litro',
            'hoja': 'hoja',
            'hojas': 'hoja'
        }
        return numero, unit_mapping.get(unidad.lower().strip(), 'unidad')
    else:
        return cantidad, "unidad"

def get_numeric_value(value, default='0'):
    """Extrae el valor numérico de una cadena o devuelve un valor por defecto"""
    try:
        if not value or value.strip() == '':
            return default
        return value.split()[0]
    except (IndexError, AttributeError):
        return default

def map_category(category):
    """Mapea las categorías del CSV a las categorías permitidas en la base de datos"""
    allowed_categories = {
        'Aves',
        'Carnes',
        'Ensaladas',
        'Fast Food',
        'Legumbres',
        'Pastas y Arroces',
        'Pescados',
        'Sopas y Cremas',
        'Vegetariano',
        'Desayuno',
        'Huevos',
        'Snack'
    }
    return category if category in allowed_categories else 'Otros'

def map_ingredient_category(category):
    """Mapea las categorías del CSV a las categorías del enum ingredient_category"""
    category_mapping = {
        'Lácteos y Derivados': 'Lácteos, Huevos y Derivados',
        'Vegetales y Legumbres': 'Vegetales y Legumbres',
        'Cereales y Derivados': 'Cereales y Derivados',
        'Carnicería': 'Carnicería',
        'Pescadería': 'Pescadería',
        'Charcutería': 'Charcutería',
        'Condimentos y Especias': 'Condimentos y Especias',
        'Salsas y Aderezos': 'Salsas y Aderezos',
        'Frutos Secos': 'Frutos Secos',
        'Frutas': 'Frutas',
        'Aceites': 'Aceites',
        'Líquidos y Caldos': 'Líquidos y Caldos',
        'Cafés e infusiones': 'Cafés e infusiones',
        'Confituras': 'Confituras'
    }
    return category_mapping.get(category, 'Otras Categorías')

def map_cuisine_type(cuisine):
    """Mapea el tipo de cocina a los valores permitidos del enum cuisine_type"""
    cuisine_mapping = {
        'italiana': 'italiana',
        'mexicana': 'mexicana',
        'española': 'española',
        'japonesa': 'japonesa',
        'china': 'china',
        'coreana': 'coreana',
        'tailandesa': 'tailandesa',
        'vietnamita': 'vietnamita',
        'india': 'india',
        'mediterránea': 'mediterránea',
        'griega': 'griega',
        'turca': 'turca',
        'libanesa': 'libanesa',
        'marroquí': 'marroquí',
        'francesa': 'francesa',
        'alemana': 'alemana',
        'británica': 'británica',
        'americana': 'americana',
        'tex-mex': 'tex-mex',
        'brasileña': 'brasileña',
        'peruana': 'peruana',
        'argentina': 'argentina',
        'colombiana': 'colombiana',
        'venezolana': 'venezolana',
        'caribeña': 'caribeña',
        'portuguesa': 'portuguesa',
        'rusa': 'rusa',
        'polaca': 'polaca',
        'nórdica': 'nórdica',
        'hawaiana': 'hawaiana',
        'fusión': 'fusión',
        'vegana': 'vegana',
        'vegetariana': 'vegetariana',
        'sin_gluten': 'sin_gluten',
        'tradicional': 'tradicional',
        'moderna': 'moderna',
        'casera': 'casera',
        'callejera': 'callejera',
        'gourmet': 'gourmet',
        'saludable': 'saludable'
    }
    # Limpiamos el string de entrada (quitamos espacios y convertimos a minúsculas)
    cuisine = cuisine.lower().strip()
    # Retornamos el valor mapeado o 'otra' si no existe
    return cuisine_mapping.get(cuisine, 'otra')

def csv_to_sql(csv_file_path, sql_file_path):
    if not os.path.isfile(csv_file_path):
        raise FileNotFoundError(f"El archivo CSV {csv_file_path} no existe.")

    # Leer CSV y procesar datos
    recipes = []
    unique_ingredients = {}
    
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        rows = list(csv_reader)
        for row in tqdm(rows, desc="Procesando recetas"):
            ingredientes = []
            for i in range(1, 21):
                ingrediente = row.get(f'ingredient_{i}', '').strip()
                cantidad_raw = row.get(f'quantity_{i}', '').strip()
                tipo_alimento = row.get(f'type_{i}', '').strip()

                if ingrediente:
                    cantidad, unidad = parse_cantidad(cantidad_raw)
                    ingredientes.append({
                        "Nombre": ingrediente,
                        "Cantidad": cantidad,
                        "Unidad": unidad,
                        "Tipo de alimento": tipo_alimento
                    })
                    # Recopilar ingredientes únicos con su categoría
                    unique_ingredients[ingrediente] = map_ingredient_category(tipo_alimento) if tipo_alimento else 'Otras Categorías'
            
            instrucciones = {f"Paso {j}": row.get(f'step_{j}', '').strip() for j in range(1, 7)}

            recipes.append({
                'name': row['name'].replace("'", "''"),
                'side_dish': row.get('side_dish', '').replace("'", "''"),
                'meal_type': row.get('meal_type', 'comida'),
                'category': row.get('category', 'Otros'),
                'servings': 4,
                'calories': row.get('calories', '0'),
                'energy_kj': row.get('energy_kj', '0'),
                'fats': row.get('fats', '0'),
                'saturated_fats': row.get('saturated_fats', '0'),
                'carbohydrates': row.get('carbohydrates', '0'),
                'sugars': row.get('sugars', '0'),
                'fiber': row.get('fiber', '0'),
                'proteins': row.get('proteins', '0'),
                'prep_time': row.get('prep_time', '45'),
                'instructions': instrucciones,
                'url': row.get('url', '').replace("'", "''"),
                'pdf_url': row.get('pdf_url', '').replace("'", "''"),
                'image_url': row.get('image_url', '').replace("'", "''"),
                'cuisine_type': row.get('cuisine_type', '').strip()
            })

    # Generar SQL
    sql = """-- Primero limpiamos las tablas existentes
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;

-- Insertar ingredientes únicos
INSERT INTO ingredients (name, category) VALUES\n"""

    # Añadir ingredientes
    for name, category in unique_ingredients.items():
        sql += f"('{name}', '{category}'),\n"
    sql = sql.rstrip(',\n') + ' ON CONFLICT (name) DO NOTHING;\n\n'

    # Insertar recetas
    sql += """-- Insertar recetas
INSERT INTO recipes (
    name, side_dish, meal_type, category, servings,
    calories, energy_kj, fats, saturated_fats, carbohydrates,
    sugars, fiber, proteins, sodium, prep_time, instructions,
    url, pdf_url, image_url, cuisine_type
) VALUES\n"""

    for recipe in recipes:
        cuisine = map_cuisine_type(recipe.get('cuisine_type', '').strip())
        sql += f"""(
    '{recipe['name']}',
    '{recipe['side_dish']}',
    '{recipe['meal_type'].lower()}',
    '{map_category(recipe['category'])}',
    {recipe['servings']},
    '{get_numeric_value(recipe['calories'])}',
    '{get_numeric_value(recipe['energy_kj'])}',
    '{get_numeric_value(recipe['fats'])}',
    '{get_numeric_value(recipe['saturated_fats'])}',
    '{get_numeric_value(recipe['carbohydrates'])}',
    '{get_numeric_value(recipe['sugars'])}',
    '{get_numeric_value(recipe['fiber'])}',
    '{get_numeric_value(recipe['proteins'])}',
    '0',
    '{recipe['prep_time'] or '45'}',
    '{json.dumps(recipe['instructions'])}'::jsonb,
    '{recipe['url']}',
    '{recipe['pdf_url']}',
    '{recipe.get('image_url', '')}',
    '{cuisine}'
),\n"""
    sql = sql.rstrip(',\n') + ';\n\n'

    # Insertar relaciones receta-ingredientes
    sql += """-- Relacionar ingredientes con recetas\n"""
    for recipe in recipes:
        # Eliminar ingredientes duplicados usando un diccionario
        unique_ingredients = {}
        for ingredient in recipe['ingredientes']:
            key = (ingredient['Nombre'], ingredient['Unidad'])
            if key not in unique_ingredients:
                unique_ingredients[key] = ingredient
            else:
                # Si el ingrediente ya existe, sumamos las cantidades
                unique_ingredients[key]['Cantidad'] += ingredient['Cantidad']

        sql += f"""WITH recipe_{recipe['name'].replace(' ', '_')} AS (
            SELECT id FROM recipes WHERE name = '{recipe['name']}'
        )
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        SELECT 
            (SELECT id FROM recipe_{recipe['name'].replace(' ', '_')}),
            i.id,
            ing.quantity,
            ing.unit::unit_type
        FROM (
            VALUES\n"""
        
        for ingredient in unique_ingredients.values():
            sql += f"    ('{ingredient['Nombre']}', {ingredient['Cantidad']}, '{ingredient['Unidad']}'),\n"
        
        sql = sql.rstrip(',\n') + f"\n) AS ing(name, quantity, unit)\nJOIN ingredients i ON i.name = ing.name\n"
        sql += "ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET quantity = EXCLUDED.quantity;\n\n"

    # Escribir el archivo SQL
    with open(sql_file_path, 'w', encoding='utf-8') as file:
        file.write(sql)

if __name__ == '__main__':
    # Usar ruta relativa
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Ruta del CSV de entrada
    csv_file_path = os.path.join(current_dir, "data", "RECETARIO - RECETAS PENAPARDA 2025.csv")
    
    # Crear directorio output si no existe
    output_dir = os.path.join(current_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    
    # Ruta del SQL de salida
    sql_file_path = os.path.join(output_dir, "output_migration.sql")
    
    csv_to_sql(csv_file_path, sql_file_path) 