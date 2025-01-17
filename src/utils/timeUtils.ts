export function parsePreparationTime(timeString: string): number {
  if (!timeString) return 999999;
  
  const timeStr = timeString.toLowerCase().trim();
  
  // Primero intentamos extraer números directamente
  const numbers = timeStr.match(/\d+/g);
  if (!numbers) return 999999;
  
  // Si solo hay un número, verificamos la unidad
  if (numbers.length === 1) {
    if (timeStr.includes('hora')) {
      return parseInt(numbers[0]) * 60;
    }
    return parseInt(numbers[0]); // Asumimos minutos por defecto
  }
  
  // Si hay dos números, asumimos que es "horas y minutos"
  if (numbers.length === 2 && timeStr.includes('hora')) {
    const hours = parseInt(numbers[0]);
    const minutes = parseInt(numbers[1]);
    return hours * 60 + minutes;
  }
  
  // Si no podemos determinar el formato, convertimos todo a minutos
  return numbers.reduce((acc, num) => acc + parseInt(num), 0);
} 