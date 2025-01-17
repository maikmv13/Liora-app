import { ShoppingItem } from '../../../types';
import { categoryOrder } from '../../../types/categories';
import { getUnitPlural } from '../../../utils/getUnitPlural';

export function filterAndSortItems(
  items: ShoppingItem[],
  viewMode: 'weekly' | 'daily',
  selectedDay: string,
  servings: number,
  showCompleted: boolean
) {
  // Ajustar cantidades según el número de comensales
  const adjustedItems = items.map(item => {
    const baseQuantity = viewMode === 'daily' && item.dailyQuantities?.[selectedDay]
      ? item.dailyQuantities[selectedDay]
      : item.quantity;

    return {
      ...item,
      quantity: (baseQuantity / 2) * servings // Ajustar para el número de comensales
    };
  });

  // Filtrar items según el modo de vista
  const filteredItems = viewMode === 'weekly'
    ? adjustedItems
    : adjustedItems.filter(item => item.days.includes(selectedDay));

  // Agrupar por categoría
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    
    if (viewMode === 'daily') {
      // En vista diaria, solo incluir la cantidad para ese día
      const dailyQuantity = item.dailyQuantities?.[selectedDay] || 0;
      acc[item.category].push({
        ...item,
        quantity: (dailyQuantity / 2) * servings,
        days: [selectedDay]
      });
    } else {
      acc[item.category].push(item);
    }
    
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Ordenar categorías y filtrar vacías
  const sortedCategories = categoryOrder
    .filter(categoria => 
      itemsByCategory[categoria] && 
      itemsByCategory[categoria].length > 0 &&
      (showCompleted || itemsByCategory[categoria].some(item => !item.checked))
    );

  // Ordenar items dentro de cada categoría
  for (const category of sortedCategories) {
    itemsByCategory[category].sort((a, b) => {
      // Primero por estado (no comprados primero)
      if (a.checked !== b.checked) {
        return a.checked ? 1 : -1;
      }
      // Luego por nombre
      return a.name.localeCompare(b.name);
    });
  }

  return {
    itemsByCategory,
    sortedCategories,
    filteredItems
  };
}

export function generateExportContent(
  sortedCategories: string[],
  itemsByCategory: Record<string, ShoppingItem[]>,
  viewMode: 'weekly' | 'daily',
  selectedDay: string,
  servings: number
) {
  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const content = viewMode === 'daily'
    ? `🛒 *Lista de Compra - ${selectedDay}* (${servings} comensales)\n📅 Generada el ${today}\n\n`
    : `🛒 *Lista de Compra Semanal* (${servings} comensales)\n📅 Generada el ${today}\n\n`;

  const itemsList = sortedCategories
    .map(categoria => {
      const items = itemsByCategory[categoria];
      const itemsList = items
        .map(item => {
          const quantity = viewMode === 'daily' && item.dailyQuantities?.[selectedDay]
            ? item.dailyQuantities[selectedDay]
            : item.quantity;
          const unit = getUnitPlural(item.unit, quantity);
          return `${item.checked ? '✅' : '⬜'} ${item.name}: ${quantity.toFixed(1)} ${unit}`;
        })
        .join('\n');
      return `*${categoria}*\n${itemsList}\n`;
    })
    .join('\n');

  return content + itemsList;
}