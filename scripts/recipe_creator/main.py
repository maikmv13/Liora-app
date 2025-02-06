import json
import os
from datetime import datetime
from src.recipe_creator import RecipeCreator
from src.constants import RECIPE_CATEGORIES
from src.console_utils import (
    print_header, print_categories, print_error, 
    print_success, print_progress, get_user_input
)

# Crear directorio de output si no existe
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    print_header("¡Bienvenido al Generador de Recetas!")
    recipe_creator = RecipeCreator()

    while True:
        # Mostrar categorías
        print_categories(RECIPE_CATEGORIES)

        try:
            # Obtener selección del usuario
            user_input = get_user_input("\nSelecciona una categoría (ejemplo: 1 o 1.2): ").strip()
            
            # Procesar selección
            if '.' in user_input:
                category_num, subcategory_num = map(int, user_input.split('.'))
                if 1 <= category_num <= len(RECIPE_CATEGORIES):
                    main_category = list(RECIPE_CATEGORIES.keys())[category_num - 1]
                    subcategories = RECIPE_CATEGORIES[main_category]
                    if 1 <= subcategory_num <= len(subcategories):
                        recipe_type = subcategories[subcategory_num - 1]
                    else:
                        print_error("Número de subcategoría inválido")
                        continue
                else:
                    print_error("Número de categoría inválido")
                    continue
            else:
                # Selección por pasos
                category_num = int(user_input)
                if 1 <= category_num <= len(RECIPE_CATEGORIES):
                    main_category = list(RECIPE_CATEGORIES.keys())[category_num - 1]
                    subcategories = RECIPE_CATEGORIES[main_category]
                    
                    # Mostrar subcategorías
                    print(f"\nSubcategorías de {main_category}:")
                    for i, subcategory in enumerate(subcategories, 1):
                        icon = SUBCATEGORY_ICONS.get(subcategory, '•')
                        print(f"{i}. {icon} {subcategory}")
                    
                    subcategory_num = int(get_user_input("\nSelecciona el número de la subcategoría: "))
                    if 1 <= subcategory_num <= len(subcategories):
                        recipe_type = subcategories[subcategory_num - 1]
                    else:
                        print_error("Número de subcategoría inválido")
                        continue
                else:
                    print_error("Número de categoría inválido")
                    continue

            # Obtener número de recetas
            while True:
                try:
                    num_recipes = int(get_user_input("\n¿Cuántas recetas quieres generar? "))
                    if num_recipes > 0:
                        break
                    print_error("Por favor, introduce un número mayor que 0")
                except ValueError:
                    print_error("Por favor, introduce un número válido")

            # Generar recetas
            recipes = []
            print_progress(f"\nGenerando {num_recipes} receta{'s' if num_recipes > 1 else ''}...")
            
            for i in range(num_recipes):
                print_progress(f"\nGenerando receta {i + 1} de {num_recipes}...")
                recipe = recipe_creator.generate_recipe(recipe_type)
                if recipe:
                    recipes.append(recipe)
                    print_success(f"Receta generada: {recipe['name']}")

            # Guardar recetas
            if recipes:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"recetas_{recipe_type.lower().replace(' ', '_')}_{timestamp}.json"
                filepath = os.path.join(OUTPUT_DIR, filename)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(recipes, f, ensure_ascii=False, indent=2)
                
                print_success(f"\n¡Listo! Se han guardado {len(recipes)} recetas en '{filename}'")
            else:
                print_error("\nNo se pudieron generar recetas. Por favor, intenta de nuevo.")

            # Preguntar si quiere generar más
            if get_user_input("\n¿Quieres generar más recetas? (s/n): ").lower() != 's':
                break

        except ValueError:
            print_error("Por favor, introduce un número válido (ejemplo: 1 o 1.2)")
        except Exception as e:
            print_error(f"Error inesperado: {e}")

if __name__ == "__main__":
    main() 