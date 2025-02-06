# Unidades de medida y formateadores
UNITS_OF_MEASURE = {
    'weight': {
        'unit': 'gramo'
    },
    'volume': {
        'unit': 'mL'
    },
    'units': {
        'singular': 'unidad',
        'plural': 'unidades'
    },
    'others': {
        'hoja': 'hoja',
        'pizca': 'pizca',
        'cucharada': 'cucharada',
        'cucharadita': 'cucharadita',
        'rebanada': 'rebanada'
    }
}

NUTRITION_UNITS = {
    'energy_kj': {
        'unit': 'kJ',
        'format': lambda x: f"{int(x)} kJ"
    },
    'calories': {
        'unit': 'kcal',
        'format': lambda x: f"{int(x)} kcal"
    },
    'fats': {
        'unit': 'g',
        'format': lambda x: f"{x:.1f} g"
    },
    'saturated_fats': {
        'unit': 'g',
        'format': lambda x: f"{x:.1f} g"
    },
    'carbohydrates': {
        'unit': 'g',
        'format': lambda x: f"{x:.1f} g"
    },
    'sugars': {
        'unit': 'g',
        'format': lambda x: f"{x:.1f} g"
    },
    'fiber': {
        'unit': 'g',
        'format': lambda x: f"{x:.1f} g"
    },
    'proteins': {
        'unit': 'g',
        'format': lambda x: f"{x:.1f} g"
    }
} 