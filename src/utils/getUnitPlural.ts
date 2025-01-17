const unitPlurals: Record<string, string> = {
  'gramo': 'gramos',
  'unidad': 'unidades',
  'mililitro': 'mililitros',
  'rebanada': 'rebanadas',
  'cucharada': 'cucharadas',
  'cucharadita': 'cucharaditas',
  'sobre': 'sobres',
  'vaso': 'vasos',
  'pizca': 'pizcas',
  'litro': 'litros',
  'hoja': 'hojas'
};

export function getUnitPlural(unit: string, quantity: number): string {
  if (quantity <= 1) return unit;
  return unitPlurals[unit.toLowerCase()] || unit;
}