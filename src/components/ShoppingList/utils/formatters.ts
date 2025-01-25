// Función para formatear números eliminando decimales innecesarios
export function formatNumber(num: number): string {
  return Number.isInteger(num) ? Math.floor(num).toString() : num.toFixed(1);
}

// Función para convertir unidades a mayor escala cuando sea necesario
export function convertUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const lowerUnit = unit.toLowerCase();
  
  if ((lowerUnit === 'gramos' || lowerUnit === 'gr' || lowerUnit === 'g') && quantity >= 1000) {
    return {
      quantity: quantity / 1000,
      unit: 'kilos'
    };
  }
  
  if ((lowerUnit === 'mililitros' || lowerUnit === 'ml') && quantity >= 1000) {
    return {
      quantity: quantity / 1000,
      unit: 'litros'
    };
  }
  
  return { quantity, unit };
}

interface FormattedQuantity {
  quantity: number;
  unit: string;
  shouldBePlural: boolean;
  displayValue: string;
}

// Función para formatear la cantidad y unidad
export function formatQuantityAndUnit(quantity: number, unit: string): FormattedQuantity {
  // Convertir unidades si es necesario
  const converted = convertUnit(quantity, unit);
  
  // Formatear el número eliminando decimales innecesarios
  const formattedQuantity = Number(converted.quantity);
  const displayValue = Number.isInteger(formattedQuantity) 
    ? formattedQuantity.toString() 
    : formattedQuantity.toFixed(1);
  
  // Determinar si usar plural
  const shouldBePlural = formattedQuantity !== 1;
  
  return {
    quantity: formattedQuantity,
    unit: converted.unit,
    shouldBePlural,
    displayValue
  };
}