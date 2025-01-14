import { ShoppingItem } from '../../../types';
import { categoryOrder } from '../../../data/categories';

export function filterAndSortItems(
  items: ShoppingItem[],
  viewMode: 'weekly' | 'daily',
  selectedDay: string,
  servings: number,
  showCompleted: boolean
) {
  // Adjust quantities based on servings
  const adjustedItems = items.map(item => ({
    ...item,
    quantity: (item.quantity / 2) * servings
  }));

  // Filter items based on view mode
  const filteredItems = viewMode === 'weekly' 
    ? adjustedItems 
    : adjustedItems.filter(item => item.days.includes(selectedDay));

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    
    if (viewMode === 'daily') {
      acc[item.category].push({
        ...item,
        days: [selectedDay]
      });
    } else {
      acc[item.category].push(item);
    }
    
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Sort categories and filter empty ones
  const sortedCategories = categoryOrder
    .filter(categoria => 
      itemsByCategory[categoria] && 
      itemsByCategory[categoria].length > 0 &&
      (showCompleted || itemsByCategory[categoria].some(item => !item.checked))
    );

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
        .map(item => `${item.checked ? '✅' : '⬜'} ${item.name}: ${item.quantity} ${item.unit}`)
        .join('\n');
      return `*${categoria}*\n${itemsList}\n`;
    })
    .join('\n');

  return content + itemsList;
}