from typing import Dict
from .units import UNITS_OF_MEASURE, NUTRITION_UNITS
from .constants import INGREDIENTS_BY_TYPE

class QuantityFormatter:
    @staticmethod
    def format_quantity(quantity: float, unit: str) -> str:
        """Formatea la cantidad usando siempre gramo y mL"""
        try:
            qty = float(quantity)
        except ValueError:
            return f"{quantity} {unit}"

        # Manejo de unidades de peso
        if unit.lower() in ['g', 'gr', 'grs', 'gramos', 'gramo', 'kg', 'kilogramo', 'kilogramos']:
            if unit.lower().startswith('k'):
                qty = qty * 1000
            return f"{int(qty)} {UNITS_OF_MEASURE['weight']['unit']}"

        # Manejo de unidades de volumen
        elif unit.lower() in ['ml', 'mililitro', 'mililitros', 'l', 'litro', 'litros']:
            if unit.lower().startswith('l'):
                qty = qty * 1000
            return f"{int(qty)} {UNITS_OF_MEASURE['volume']['unit']}"

        # Manejo de unidades contables
        elif unit.lower() in ['unidad', 'unidades', 'ud', 'uds']:
            if qty == 1:
                return f"{int(qty)} {UNITS_OF_MEASURE['units']['singular']}"
            else:
                return f"{int(qty)} {UNITS_OF_MEASURE['units']['plural']}"

        # Manejo de otras unidades específicas
        elif unit.lower() in UNITS_OF_MEASURE['others']:
            return f"{int(qty)} {UNITS_OF_MEASURE['others'][unit.lower()]}"

        return f"{quantity} {unit}"

    @staticmethod
    def format_nutrition_value(key: str, value: float) -> str:
        """Formatea los valores nutricionales según las reglas especificadas"""
        if key in NUTRITION_UNITS:
            try:
                value_float = float(value)
                return NUTRITION_UNITS[key]['format'](value_float)
            except (ValueError, TypeError):
                return f"0 {NUTRITION_UNITS[key]['unit']}"
        return str(value)

    @staticmethod
    def get_ingredient_type(ingredient_name: str) -> str:
        """Determina el tipo de ingrediente"""
        for type_name, ingredients in INGREDIENTS_BY_TYPE.items():
            if ingredient_name.lower() in [ing.lower() for ing in ingredients]:
                return type_name
        return "Otras Categorías" 