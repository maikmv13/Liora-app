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

def print_welcome():
    print("\n" + "="*50)
    print("       ¡Bienvenido al Generador de Recetas!       ")
    print("="*50 + "\n")

def print_categories():
    print("Categorías disponibles:")
    for i, (category, subcategories) in enumerate(RECIPE_CATEGORIES.items(), 1):
        print(f"{i}. {category}")
        for j, subcategory in enumerate(subcategories, 1):
            print(f"   {i}.{j} • {subcategory}")

def get_recipe_type_from_input() -> str:
    """Obtiene el tipo de receta desde la entrada del usuario"""
    while True:
        try:
            choice = input("\nSelecciona una categoría (ejemplo: 1 o 1.2): ").strip()
            if '.' in choice:
                main_cat, sub_cat = map(int, choice.split('.'))
                main_cat -= 1  # Ajustar a índice base 0
                sub_cat -= 1
                
                category = list(RECIPE_CATEGORIES.keys())[main_cat]
                return RECIPE_CATEGORIES[category][sub_cat]
            else:
                main_cat = int(choice) - 1
                category = list(RECIPE_CATEGORIES.keys())[main_cat]
                return list(RECIPE_CATEGORIES[category])[0]
        except (ValueError, IndexError):
            print_error("Selección inválida. Por favor, intenta de nuevo.")

def get_manual_recipe_input() -> tuple:
    """Obtiene el nombre y acompañamiento de la receta manualmente"""
    name = input("\nIntroduce el nombre del plato principal: ").strip()
    side_dish = input("Introduce el acompañamiento: ").strip()
    if not side_dish.startswith("con "):
        side_dish = "con " + side_dish
    return name, side_dish

def save_recipes(recipes: list, recipe_type: str) -> str:
    """Guarda las recetas en un archivo JSON y retorna el nombre del archivo"""
    if not recipes:
        return None
        
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    category_slug = recipe_type.lower().replace(' ', '_')
    filename = f"recetas_{category_slug}_{timestamp}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    try:
        # Asegurar que el directorio existe
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Guardar el archivo
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(recipes, f, indent=2, ensure_ascii=False)
            
        print_success(f"Recetas guardadas en: {filepath}")
        return filename
        
    except Exception as e:
        print_error(f"Error al guardar las recetas: {e}")
        return None

def main():
    try:
        # Mostrar categorías disponibles
        print("\nCategorías de recetas disponibles:")
        print_categories()
        
        # Obtener selección del usuario
        category = input("\nSelecciona una categoría (ejemplo: 1 o 1.2): ")
        recipe_type = get_recipe_type_from_input()
        
        if not recipe_type:
            print_error("Categoría no válida")
            return
            
        # Preguntar si quiere generar imágenes
        generate_images = input("\n¿Deseas generar imágenes para las recetas? (s/n): ").lower() == 's'
        
        # Obtener número de recetas
        num_recipes = int(input("\n¿Cuántas recetas quieres generar? "))
        if num_recipes < 1:
            print_error("El número de recetas debe ser mayor que 0")
            return
            
        print_progress(f"\nGenerando {num_recipes} recetas...")
        
        # Crear instancia de RecipeCreator
        creator = RecipeCreator()
        
        # Generar recetas
        recipes = []
        for i in range(num_recipes):
            print_progress(f"\nGenerando receta {i + 1} de {num_recipes}...")
            recipe = creator.generate_recipe(recipe_type, generate_images=generate_images)
            if recipe:
                recipes.append(recipe)
            else:
                print_error(f"\nNo se pudo generar la receta {i + 1}")
        
        # Guardar recetas
        if recipes:
            filename = save_recipes(recipes, recipe_type)
            if filename:
                print_success(f"\nSe han guardado {len(recipes)} recetas en '{filename}'")
        else:
            print_error("\nNo se pudieron generar recetas. Por favor, intenta de nuevo.")
            
    except Exception as e:
        print_error(f"\nError inesperado: {str(e)}")

if __name__ == "__main__":
    main() 