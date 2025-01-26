import { supabase } from '../lib/supabase';
import type { MenuItem, MealType } from '../types';
import { DAY_MAPPING, MEAL_MAPPING } from '../components/WeeklyMenu2/constants';
import type { Database } from '../types/supabase';

// Tipos base de la base de datos
type WeeklyMenu = Database['public']['Tables']['weekly_menus']['Row'];
type WeeklyMenuUpdate = Database['public']['Tables']['weekly_menus']['Update'];
type WeeklyMenuInsert = Database['public']['Tables']['weekly_menus']['Insert'];
type Recipe = Database['public']['Tables']['recipes']['Row'];

export interface ExtendedWeeklyMenuDB extends WeeklyMenu {
  recipes?: Recipe[];
}

// Función auxiliar para obtener una receta aleatoria por tipo de comida
function getRandomRecipe(recipes: Recipe[], mealType: string): Recipe | null {
  if (!Array.isArray(recipes)) return null;
  
  const filteredRecipes = recipes.filter(recipe => recipe.meal_type === mealType);
  if (filteredRecipes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
  return filteredRecipes[randomIndex];
}

async function getHouseholdFavoriteRecipes(householdId: string): Promise<Recipe[]> {
  try {
    // 1. Obtener todos los usuarios del household
    const { data: householdMembers } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('linked_household_id', householdId);

    if (!householdMembers?.length) return [];

    // 2. Obtener los IDs de las recetas favoritas de todos los miembros
    const { data: favorites } = await supabase
      .from('favorites')
      .select('recipe_id')
      .in('user_id', householdMembers.map(member => member.user_id));

    if (!favorites?.length) return [];

    // 3. Obtener las recetas completas
    const { data: recipes } = await supabase
      .from('recipes')
      .select('*')
      .in('id', favorites.map(fav => fav.recipe_id));

    return recipes || [];
  } catch (error) {
    console.error('Error getting household favorites:', error);
    return [];
  }
}

export async function createWeeklyMenu(
  userId: string,
  recipes: Recipe[],
  isHousehold: boolean = false
) {
  try {
    // 1. Obtener perfil y verificar household
    const { data: profile } = await supabase
      .from('profiles')
      .select('linked_household_id')
      .eq('user_id', userId)
      .single();

    // 2. Obtener las recetas correctas según el contexto
    let menuRecipes: Recipe[] = [];
    if (profile?.linked_household_id) {
      // Si es un household, obtener favoritos de todos los miembros
      menuRecipes = await getHouseholdFavoriteRecipes(profile.linked_household_id);
      console.log('Recetas del household:', menuRecipes);
    } else {
      // Si es personal, usar las recetas proporcionadas
      menuRecipes = Array.isArray(recipes) ? recipes : [];
      console.log('Recetas personales:', menuRecipes);
    }

    if (!menuRecipes.length) {
      throw new Error('No hay suficientes recetas favoritas para generar el menú');
    }

    // 3. Archivar menús existentes
    if (profile?.linked_household_id) {
      await supabase
        .from('weekly_menus')
        .update({ status: 'archived' })
        .eq('status', 'active')
        .eq('linked_household_id', profile.linked_household_id);
    } else {
      await supabase
        .from('weekly_menus')
        .update({ status: 'archived' })
        .eq('status', 'active')
        .eq('user_id', userId);
    }

    // 4. Crear el nuevo menú
    const menuData = {
      ...(profile?.linked_household_id 
        ? { linked_household_id: profile.linked_household_id }
        : { user_id: userId }
      ),
      status: 'active' as const,
      created_at: new Date().toISOString(),
    };

    // Añadir las recetas al menú
    const mealTypes = [
      { type: 'desayuno', column: 'breakfast' },
      { type: 'comida', column: 'lunch' },
      { type: 'snack', column: 'snack' },
      { type: 'cena', column: 'dinner' }
    ];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      mealTypes.forEach(({ type, column }) => {
        const recipe = getRandomRecipe(menuRecipes, type);
        if (recipe) {
          menuData[`${day}_${column}_id` as keyof typeof menuData] = recipe.id;
        }
      });
    });

    console.log('Menu data a insertar:', menuData);

    const { data: newMenu, error } = await supabase
      .from('weekly_menus')
      .insert(menuData)
      .select()
      .single();

    if (error) throw error;
    return newMenu;

  } catch (error) {
    console.error('Error creating weekly menu:', error);
    throw error;
  }
}

export async function updateMenuRecipe(
  menuId: string,
  day: string,
  meal: MealType,
  recipeId: string | null
): Promise<void> {
  try {
    const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === day)?.[0];
    // Mapear el tipo de comida a la columna correcta
    const mealMapping = {
      'desayuno': 'breakfast',
      'comida': 'lunch',
      'snack': 'snack',
      'cena': 'dinner'
    };
    const mealKey = mealMapping[meal];
    
    if (!dayKey || !mealKey) {
      throw new Error('Invalid day or meal type');
    }

    const fieldName = `${dayKey}_${mealKey}_id` as keyof WeeklyMenuUpdate;
    
    // Primero obtenemos el menú para verificar si existe
    const { data: menu } = await supabase
      .from('weekly_menus')
      .select('id, linked_household_id, user_id')
      .eq('id', menuId)
      .single();

    if (!menu) {
      throw new Error('No hay un menú activo');
    }

    // Actualizamos el menú
    const { error } = await supabase
      .from('weekly_menus')
      .update({ [fieldName]: recipeId })
      .eq('id', menuId);

    if (error) {
      console.error('Error al actualizar el menú:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating menu recipe:', error);
    throw error;
  }
}

export async function getActiveMenu(
  userId?: string,
  isHousehold?: boolean
): Promise<ExtendedWeeklyMenuDB | null> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      userId = user.id;
    }

    // Obtener el perfil para verificar el household
    const { data: profile } = await supabase
      .from('profiles')
      .select('linked_household_id')
      .eq('user_id', userId)
      .single();

    const householdId = isHousehold ? profile?.linked_household_id : null;

    // Obtener el menú activo usando el ID correcto
    const { data: menu, error: menuError } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        monday_breakfast:monday_breakfast_id(*),
        monday_lunch:monday_lunch_id(*),
        monday_snack:monday_snack_id(*),
        monday_dinner:monday_dinner_id(*),
        tuesday_breakfast:tuesday_breakfast_id(*),
        tuesday_lunch:tuesday_lunch_id(*),
        tuesday_snack:tuesday_snack_id(*),
        tuesday_dinner:tuesday_dinner_id(*),
        wednesday_breakfast:wednesday_breakfast_id(*),
        wednesday_lunch:wednesday_lunch_id(*),
        wednesday_snack:wednesday_snack_id(*),
        wednesday_dinner:wednesday_dinner_id(*),
        thursday_breakfast:thursday_breakfast_id(*),
        thursday_lunch:thursday_lunch_id(*),
        thursday_snack:thursday_snack_id(*),
        thursday_dinner:thursday_dinner_id(*),
        friday_breakfast:friday_breakfast_id(*),
        friday_lunch:friday_lunch_id(*),
        friday_snack:friday_snack_id(*),
        friday_dinner:friday_dinner_id(*),
        saturday_breakfast:saturday_breakfast_id(*),
        saturday_lunch:saturday_lunch_id(*),
        saturday_snack:saturday_snack_id(*),
        saturday_dinner:saturday_dinner_id(*),
        sunday_breakfast:sunday_breakfast_id(*),
        sunday_lunch:sunday_lunch_id(*),
        sunday_snack:sunday_snack_id(*),
        sunday_dinner:sunday_dinner_id(*)
      `)
      .eq('status', 'active')
      .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? householdId : userId)
      .single();

    if (menuError) throw menuError;
    return menu;

  } catch (error) {
    console.error('Error getting active menu:', error);
    return null;
  }
}

export async function archiveMenu(menuId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('weekly_menus')
      .update({ status: 'archived' })
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error archiving menu:', error);
    throw error;
  }
}

export async function deleteMenu(menuId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('weekly_menus')
      .delete()
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
}

export async function getMenuHistory(
  userId: string,
  isHousehold: boolean
): Promise<ExtendedWeeklyMenuDB[]> {
  try {
    // Obtener el perfil para verificar el household
    const { data: profile } = await supabase
      .from('profiles')
      .select('linked_household_id')
      .eq('user_id', userId)
      .single();

    const householdId = isHousehold ? profile?.linked_household_id : null;

    // Obtener los menús archivados
    const { data: menus, error: menusError } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        monday_breakfast:monday_breakfast_id(*),
        monday_lunch:monday_lunch_id(*),
        monday_snack:monday_snack_id(*),
        monday_dinner:monday_dinner_id(*),
        tuesday_breakfast:tuesday_breakfast_id(*),
        tuesday_lunch:tuesday_lunch_id(*),
        tuesday_snack:tuesday_snack_id(*),
        tuesday_dinner:tuesday_dinner_id(*),
        wednesday_breakfast:wednesday_breakfast_id(*),
        wednesday_lunch:wednesday_lunch_id(*),
        wednesday_snack:wednesday_snack_id(*),
        wednesday_dinner:wednesday_dinner_id(*),
        thursday_breakfast:thursday_breakfast_id(*),
        thursday_lunch:thursday_lunch_id(*),
        thursday_snack:thursday_snack_id(*),
        thursday_dinner:thursday_dinner_id(*),
        friday_breakfast:friday_breakfast_id(*),
        friday_lunch:friday_lunch_id(*),
        friday_snack:friday_snack_id(*),
        friday_dinner:friday_dinner_id(*),
        saturday_breakfast:saturday_breakfast_id(*),
        saturday_lunch:saturday_lunch_id(*),
        saturday_snack:saturday_snack_id(*),
        saturday_dinner:saturday_dinner_id(*),
        sunday_breakfast:sunday_breakfast_id(*),
        sunday_lunch:sunday_lunch_id(*),
        sunday_snack:sunday_snack_id(*),
        sunday_dinner:sunday_dinner_id(*)
      `)
      .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? householdId : userId)
      .eq('status', 'archived')
      .order('created_at', { ascending: false });

    if (menusError) throw menusError;
    return menus || [];

  } catch (error) {
    console.error('Error getting menu history:', error);
    return [];
  }
}