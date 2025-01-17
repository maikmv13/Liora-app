export async function handleUpdateMenuRecipe(
  menuId: string,
  day: string,
  meal: MealType,
  recipeId: string | null
): Promise<void> {
  try {
    if (!menuId) {
      throw new Error('No hay un menú activo');
    }

    // Convertir día y comida al formato de la base de datos
    const dayMapping: Record<string, string> = {
      'Lunes': 'monday',
      'Martes': 'tuesday',
      'Miércoles': 'wednesday',
      'Jueves': 'thursday',
      'Viernes': 'friday'
    };

    const mealMapping: Record<MealType, string> = {
      'desayuno': 'breakfast',
      'comida': 'lunch',
      'merienda': 'snack',
      'cena': 'dinner'
    };

    const dbDay = dayMapping[day];
    const dbMeal = mealMapping[meal];
    
    if (!dbDay || !dbMeal) {
      throw new Error('Día o comida inválidos');
    }

    const fieldName = `${dbDay}_${dbMeal}`;
    
    const { error } = await supabase
      .from('weekly_menus')
      .update({ [fieldName]: recipeId })
      .eq('id', menuId);

    if (error) throw error;

  } catch (error) {
    console.error('Error al actualizar la receta en el menú:', error);
    throw error;
  }
} 