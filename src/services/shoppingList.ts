import { MenuItem, ShoppingItem } from '../types';
import { categoryOrder } from '../types/categories';

export function generateShoppingList(menuItems: MenuItem[]): ShoppingItem[] {
  console.log('Generating shopping list for:', menuItems);
  const ingredientMap = new Map<string, ShoppingItem>();

  menuItems.forEach(({ recipe, day }) => {
    if (!recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
      console.warn(`No ingredients found for recipe: ${recipe.name}`);
      return;
    }

    recipe.recipe_ingredients.forEach(ri => {
      // Skip if ingredient data is missing or incomplete
      if (!ri.ingredients?.name || !ri.unit || !ri.ingredients.category) {
        console.warn(`Incomplete ingredient data for recipe ${recipe.name}:`, ri);
        return;
      }

      const name = ri.ingredients.name;
      const baseQuantity = ri.quantity || 0;
      // Scale quantity for 2 people by default
      const scaledQuantity = recipe.servings ? (baseQuantity / recipe.servings) * 2 : baseQuantity;
      const unit = ri.unit;
      const category = ri.ingredients.category;

      const key = `${name}-${unit}`; // Use name and unit as key to prevent duplicates with different units

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        existing.quantity += scaledQuantity;
        if (!existing.days.includes(day)) {
          existing.days.push(day);
        }
      } else {
        ingredientMap.set(key, {
          id: ri.id,
          name,
          quantity: scaledQuantity,
          unit,
          category,
          checked: false,
          days: [day]
        });
      }
    });
  });

  const shoppingList = Array.from(ingredientMap.values());
  
  // Sort by category and then by name
  const sortedList = shoppingList.sort((a, b) => {
    const categoryIndexA = categoryOrder.indexOf(a.category as any);
    const categoryIndexB = categoryOrder.indexOf(b.category as any);
    
    if (categoryIndexA !== categoryIndexB) {
      return categoryIndexA - categoryIndexB;
    }
    
    return a.name.localeCompare(b.name);
  });

  console.log('Generated shopping list:', sortedList);
  return sortedList;
}