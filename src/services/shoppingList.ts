import { MenuItem, ShoppingItem } from '../types';
import { categoryOrder } from '../types/categories';

export function generateShoppingList(menuItems: MenuItem[]): ShoppingItem[] {
  console.log('generateShoppingList called with:', menuItems);
  
  const itemsMap = new Map<string, ShoppingItem>();

  menuItems.forEach(menuItem => {
    const { recipe, day } = menuItem;
    console.log('Processing recipe:', { recipe, day });
    
    if (!recipe.recipe_ingredients) {
      console.warn('Recipe has no ingredients:', recipe);
      return;
    }

    recipe.recipe_ingredients.forEach(ri => {
      if (!ri.ingredients) {
        console.warn('Recipe ingredient has no ingredient details:', ri);
        return;
      }

      console.log('Processing ingredient:', ri);
      const ingredient = ri.ingredients;
      const key = ingredient.name.toLowerCase();

      if (itemsMap.has(key)) {
        const existingItem = itemsMap.get(key)!;
        existingItem.quantity += ri.quantity;
        if (!existingItem.days.includes(day)) {
          existingItem.days.push(day);
        }
        console.log('Updated existing item:', existingItem);
      } else {
        const newItem = {
          id: ingredient.id,
          name: ingredient.name,
          quantity: ri.quantity,
          unit: ri.unit,
          category: ingredient.category,
          checked: false,
          days: [day],
          menu: menuItem.menu // Agregar referencia al menú
        };
        itemsMap.set(key, newItem);
        console.log('Added new item:', newItem);
      }
    });
  });

  const result = Array.from(itemsMap.values())
    .sort((a, b) => a.category.localeCompare(b.category));
  
  console.log('Final shopping list:', result);
  return result;
}