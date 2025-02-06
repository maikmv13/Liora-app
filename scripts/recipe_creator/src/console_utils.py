from colorama import init, Fore, Style
from typing import Dict, List

# Inicializar colorama para Windows
init()

# Iconos para categorías
CATEGORY_ICONS = {
    'Carnes': '🥩',
    'Pescados y Mariscos': '🐟',
    'Lácteos y Derivados': '🥛',
    'Panadería y Repostería': '🥖',
    'Verduras y Hortalizas': '🥬',
    'Condimentos y Aceites': '🧂',
    'Otros': '🥗'
}

# Iconos para subcategorías
SUBCATEGORY_ICONS = {
    'Aves': '🍗',
    'Cerdo': '🥓',
    'Ternera y Vacuno': '🥩',
    'Cordero': '🐑',
    'Pescados Blancos': '🐟',
    'Pescados Azules': '🐟',
    'Mariscos Crustáceos': '🦐',
    'Mariscos Moluscos': '🦪',
    'Verduras Básicas': '🥕',
    'Verduras de Hoja': '🥬',
    'Verduras de Raíz': '🥔',
    'Setas y Hongos': '🍄',
    # ... añadir más iconos según necesites
}

def print_header(text: str):
    """Imprime un encabezado con formato"""
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*50}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{text.center(50)}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{'='*50}{Style.RESET_ALL}\n")

def print_categories(categories: Dict):
    """Imprime las categorías con formato e iconos"""
    print(f"{Fore.GREEN}{Style.BRIGHT}Categorías disponibles:{Style.RESET_ALL}")
    for i, (category, subcategories) in enumerate(categories.items(), 1):
        icon = CATEGORY_ICONS.get(category, '•')
        print(f"{Fore.WHITE}{Style.BRIGHT}{i}. {icon} {category}{Style.RESET_ALL}")
        for j, subcategory in enumerate(subcategories, 1):
            subicon = SUBCATEGORY_ICONS.get(subcategory, '•')
            print(f"   {Fore.CYAN}{i}.{j} {subicon} {subcategory}{Style.RESET_ALL}")

def print_error(text: str):
    """Imprime un mensaje de error con formato"""
    print(f"{Fore.RED}{Style.BRIGHT}❌ Error: {text}{Style.RESET_ALL}")

def print_success(text: str):
    """Imprime un mensaje de éxito con formato"""
    print(f"{Fore.GREEN}{Style.BRIGHT}✅ {text}{Style.RESET_ALL}")

def print_progress(text: str):
    """Imprime un mensaje de progreso con formato"""
    print(f"{Fore.YELLOW}{Style.BRIGHT}⏳ {text}{Style.RESET_ALL}")

def get_user_input(prompt: str) -> str:
    """Obtiene input del usuario con formato"""
    return input(f"{Fore.CYAN}{Style.BRIGHT}{prompt}{Style.RESET_ALL}") 