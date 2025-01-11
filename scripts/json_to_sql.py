import json

def json_to_sql_migration():
    # Leer el archivo JSON
    with open('recipes.json', 'r', encoding='utf-8') as file:
        recipes = json.load(file)
    
    # Iniciar el SQL
    sql = """-- Primero limpiamos las tablas existentes
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;

-- Insertar ingredientes únicos
INSERT INTO ingredients (name, category) VALUES\n"""

    # Recopilar ingredientes únicos y sus categorías
    unique_ingredients = {}
    for recipe in recipes:
        for ingredient in recipe['Ingredientes']:
            name = ingredient['Nombre']
            # Asignar categoría basada en el nombre del ingrediente
            category = 'Otros'  # Función para determinar categoría
            unique_ingredients[name] = category
    
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
    url, pdf_url
) VALUES\n"""

    for recipe in recipes:
        sql += f"""(
    '{recipe['Plato']}',
    '{recipe['Acompañamiento']}',
    '{recipe['Tipo'].lower()}',
    '{recipe['Categoria']}',
    {recipe['Comensales']},
    '{recipe['Calorias'].split()[0]}',
    '{recipe['Valor energético (kJ)'].split()[0]}',
    '{recipe['Grasas'].split()[0]}',
    '{recipe['Saturadas'].split()[0]}',
    '{recipe['Carbohidratos'].split()[0]}',
    '{recipe['Azúcares'].split()[0]}',
    '{recipe['Fibra'].split()[0]}',
    '{recipe['Proteínas'].split()[0]}',
    '{recipe['Sodio'].split()[0]}',
    '{recipe['Tiempo de preparación'] or '45'}',
    '{json.dumps(recipe['Instrucciones'])}'::jsonb,
    '{recipe['Url']}',
    '{recipe['PDF_Url']}'
),\n"""
    sql = sql.rstrip(',\n') + ';\n\n'

    # Insertar relaciones receta-ingredientes
    sql += """-- Relacionar ingredientes con recetas
"""
    for recipe in recipes:
        sql += f"""WITH recipe_{recipe['Plato'].replace(' ', '_')} AS (
    SELECT id FROM recipes WHERE name = '{recipe['Plato']}'
)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
    (SELECT id FROM recipe_{recipe['Plato'].replace(' ', '_')}),
    i.id,
    ing.quantity,
    ing.unit::unit_type
FROM (
    VALUES\n"""
        
        for ingredient in recipe['Ingredientes']:
            sql += f"    ('{ingredient['Nombre']}', {ingredient['Cantidad']}, '{ingredient['Unidad']}'),\n"
        
        sql = sql.rstrip(',\n') + f"\n) AS ing(name, quantity, unit)\nJOIN ingredients i ON i.name = ing.name;\n\n"

    # Escribir el archivo SQL
    with open('output_migration.sql', 'w', encoding='utf-8') as file:
        file.write(sql)

if __name__ == '__main__':
    json_to_sql_migration()