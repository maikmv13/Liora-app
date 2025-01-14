const unitPlurals: Record<string, string> = {
  'unidad': 'unidades',
  'diente': 'dientes',
  'cucharada': 'cucharadas',
  'cucharadita': 'cucharaditas',
  'taza': 'tazas',
  'pizca': 'pizcas',
  'hoja': 'hojas',
  'rama': 'ramas',
  'lata': 'latas',
  'paquete': 'paquetes',
  'trozo': 'trozos',
  'loncha': 'lonchas',
  'filete': 'filetes',
  'pieza': 'piezas',
  'rodaja': 'rodajas',
  'rebanada': 'rebanadas',
  'tallo': 'tallos',
  'cabeza': 'cabezas',
  'racimo': 'racimos',
  'manojo': 'manojos',
  'grano': 'granos',
  'vaso': 'vasos',
  'botella': 'botellas',
  'bote': 'botes',
  'sobre': 'sobres',
  'pellizco': 'pellizcos'
};

export function getUnitPlural(unit: string, quantity: number): string {
  if (quantity <= 1) return unit;
  
  // Unidades que no cambian en plural
  const invariableUnits = ['g', 'kg', 'ml', 'l', 'cc'];
  if (invariableUnits.includes(unit.toLowerCase())) return unit;
  
  return unitPlurals[unit.toLowerCase()] || unit;
}