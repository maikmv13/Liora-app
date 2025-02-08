import React, { useState, useEffect } from 'react';
import { MenuItem, Recipe, MealType } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { TodayCard } from './TodayCard';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { MenuHistory } from './MenuHistory';
import { useMenuActions } from '../../hooks/useMenuActions';
import { useRecipes } from '../../hooks/useRecipes';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { supabase } from '../../lib/supabase';
import { weekDays } from './utils';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';
import { MenuSkeleton } from './MenuSkeleton';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { RecipeList } from '../RecipeList';
import { ChefHat } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { MenuActivityLog } from './components/MenuActivityLog';

export function WeeklyMenu2() {
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [showHistory, setShowHistory] = useState(false);
  const [menuHistory, setMenuHistory] = useState<ExtendedWeeklyMenuDB[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<MenuItem | null>(null);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: MealType;
  } | null>(null);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [menuActivities, setMenuActivities] = useState<MenuActivity[]>([]);

  const { id, isHousehold, profile } = useActiveProfile();
  const { menuItems: menu, loading: menuLoading } = useActiveMenu(id, isHousehold);
  const { recipes, loading, error } = useRecipes();
  const {
    favorites: personalFavorites,
    loading: favoritesLoading,
    error: favoritesError,
    addFavorite,
    removeFavorite
  } = useFavorites(false);

  // Cargar actividades al montar el componente
  useEffect(() => {
    const loadActivities = async () => {
      if (!profile?.linked_household_id) {
        console.log('No hay household_id para cargar actividades');
        return;
      }

      try {
        // Primero obtenemos las actividades
        const { data: activities, error } = await supabase
          .from('menu_activities')
          .select('*')
          .eq('linked_household_id', profile.linked_household_id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Luego obtenemos los datos relacionados
        const formattedActivities = await Promise.all(activities.map(async (activity) => {
          // Obtener nombre del usuario
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', activity.user_id)
            .single();

          // Obtener nombre de la receta si existe
          let recipeName = null;
          if (activity.recipe_id) {
            const { data: recipeData } = await supabase
              .from('recipes')
              .select('name')
              .eq('id', activity.recipe_id)
              .single();
            recipeName = recipeData?.name;
          }

          return {
            ...activity,
            user_name: userData?.full_name,
            recipe_name: recipeName
          };
        }));

        setMenuActivities(formattedActivities);
      } catch (error) {
        console.error('Error loading menu activities:', error);
      }
    };

    loadActivities();
  }, [profile?.linked_household_id]);

  // Handle menu updates
  const handleAddToMenu = async (recipe: Recipe | null, day: string, meal: MealType) => {
    try {
      if (!id || !profile) {
        console.error('No hay un usuario autenticado o perfil');
        return;
      }

      // Verificar si el usuario pertenece a un household
      if (isHousehold && !profile?.linked_household_id) {
        throw new Error('El usuario no está vinculado a un hogar');
      }

      const dayKey = Object.entries({
        'Lunes': 'monday',
        'Martes': 'tuesday',
        'Miércoles': 'wednesday',
        'Jueves': 'thursday',
        'Viernes': 'friday',
        'Sábado': 'saturday',
        'Domingo': 'sunday'
      }).find(([key]) => key === day)?.[1];

      const mealKey = {
        'desayuno': 'breakfast',
        'comida': 'lunch',
        'snack': 'snack',
        'cena': 'dinner'
      }[meal];

      if (!dayKey || !mealKey) {
        throw new Error('Invalid day or meal type');
      }

      const fieldName = `${dayKey}_${mealKey}_id`;

      // Obtener el menú activo usando el ID correcto del household
      const { data: activeMenu, error: menuError } = await supabase
        .from('weekly_menus')
        .select('id')
        .eq('linked_household_id', profile?.linked_household_id)
        .eq('status', 'active')
        .single();

      if (menuError) {
        console.error('Error al obtener el menú:', menuError);
        throw menuError;
      }

      // Si no hay menú activo, crear uno nuevo para el household
      if (!activeMenu) {
        const { data: newMenu, error: createError } = await supabase
          .from('weekly_menus')
          .insert([
            {
              linked_household_id: profile?.linked_household_id,
              status: 'active',
              created_at: new Date().toISOString(),
              [fieldName]: recipe?.id || null
            }
          ])
          .select('id')
          .single();

        if (createError) {
          console.error('Error al crear el menú:', createError);
          throw createError;
        }

        console.log('Nuevo menú de household creado:', newMenu?.id);
        window.location.reload();
        return;
      }

      // Actualizar el menú existente
      const { error: updateError } = await supabase
        .from('weekly_menus')
        .update({ [fieldName]: recipe?.id || null })
        .eq('id', activeMenu.id);

      if (updateError) {
        console.error('Error al actualizar el menú:', updateError);
        throw updateError;
      }

      console.log('Menú de household actualizado exitosamente');

      // Registrar la actividad
      const { error: activityError } = await supabase
        .from('menu_activities')
        .insert([{
          user_id: id,
          linked_household_id: profile.linked_household_id,
          meal_type: meal,
          day,
          recipe_id: recipe?.id || null,
          action_type: recipe ? 'add' : 'remove',
          created_at: new Date().toISOString()
        }]);

      if (activityError) throw activityError;

      // Actualizar el estado local
      const newActivity = {
        id: Date.now().toString(),
        user_id: id!,
        linked_household_id: profile.linked_household_id,
        meal_type: meal,
        day,
        recipe_id: recipe?.id || null,
        action_type: recipe ? 'add' : 'remove',
        created_at: new Date().toISOString(),
        user_name: profile.full_name,
        recipe_name: recipe?.name
      };

      setMenuActivities(prev => [newActivity, ...prev]);

      // Recargar la página después de todo el proceso
      window.location.reload();
    } catch (error) {
      console.error('Error al gestionar el menú:', error);
    }
  };

  const { 
    isGenerating, 
    lastGenerated, 
    handleGenerateMenu, 
    handleExport 
  } = useMenuActions(
    id,
    isHousehold,
    handleAddToMenu,
    (menuId: string | null) => {
      if (menuId) {
        window.location.reload();
      }
    }
  );

  const handleGenerateMenuClick = async () => {
    try {
      setIsGeneratingMenu(true);
      await handleGenerateMenu(recipes as unknown as Recipe[]);
    } catch (error) {
      console.error('Error al generar menú:', error);
      setIsGeneratingMenu(false);
    }
  };

  const handleRestoreMenu = async (menuId: string) => {
    try {
      if (id) {
        // Archivar el menú activo actual
        await supabase
          .from('weekly_menus')
          .update({ status: 'archived' })
          .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? profile?.linked_household_id : id)
          .eq('status', 'active');
      }

      // Restaurar el menú seleccionado
      await supabase
        .from('weekly_menus')
        .update({ status: 'active' })
        .eq('id', menuId);

      setShowHistory(false);
      window.location.reload();
    } catch (error) {
      console.error('Error restoring menu:', error);
    }
  };

  // Handle meal selection
  const handleMealClick = (day: string, meal: MealType) => {
    console.log('Meal clicked:', { day, meal });
    setSelectedMealInfo({ day, meal });
    setShowRecipeSelector(true);
  };

  // Handle recipe selection
  const handleRecipeSelect = async (recipe: Recipe) => {
    if (selectedMealInfo) {
      try {
        await handleAddToMenu(recipe, selectedMealInfo.day, selectedMealInfo.meal);
        setShowRecipeSelector(false);
        setSelectedMealInfo(null);
      } catch (error) {
        console.error('Error selecting recipe:', error);
      }
    }
  };

  // Añadir la función handleToggleFavorite
  const handleToggleFavorite = async (recipeId: string) => {
    try {
      const isFavorite = personalFavorites.some(f => f.recipe_id === recipeId);
      
      if (isFavorite) {
        await removeFavorite({ recipe_id: recipeId });
      } else {
        await addFavorite({ recipe_id: recipeId });
      }

      // Abrir el selector después de toggle
      setShowRecipeSelector(true);
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
    }
  };

  const renderRecipeSelector = () => {
    if (loading || favoritesLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <ChefHat size={32} className="mx-auto mb-4 text-rose-500 animate-bounce" />
            <p className="text-gray-600">Cargando recetas...</p>
          </div>
        </div>
      );
    }

    if (error || favoritesError) {
      return (
        <div className="text-center p-8">
          <div className="bg-red-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600">Error al cargar las recetas</p>
          </div>
        </div>
      );
    }

    return (
      <RecipeList
        recipes={recipes}
        onRecipeSelect={handleRecipeSelect}
        favorites={personalFavorites}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  };

  // Loading state
  if (isGeneratingMenu || menuLoading) {
    return <MenuSkeleton />;
  }

  return (
    <>
      {/* Recipe Selector Sidebar */}
      <RecipeSelectorSidebar 
        isOpen={showRecipeSelector}
        onClose={() => {
          console.log('Closing recipe selector');
          setShowRecipeSelector(false);
          setSelectedMealInfo(null);
        }}
        onSelectRecipe={handleRecipeSelect}
        selectedDay={selectedMealInfo?.day || ''}
        selectedMeal={selectedMealInfo?.meal || 'desayuno'}
      />

      {/* Contenedor principal */}
      <div>
        {/* Main content */}
        <div className="relative mb-6">
          {menuLoading ? (
            <div className="mt-4 md:mt-6">
              <MenuSkeleton />
            </div>
          ) : (
            <>
              {/* Today's Menu */}
              <div className="md:mt-6">
                <TodayCard
                  menuItems={menu}
                  onViewRecipe={setSelectedRecipe}
                  activeMenu={null}
                  onOpenOnboarding={handleGenerateMenuClick}
                />
              </div>

              {/* Weekly Menu View */}
              <div className="mt-6">
                <div className="hidden md:block">
                  <DesktopView
                    weekDays={weekDays}
                    weeklyMenu={menu}
                    onMealClick={handleMealClick}
                    onRemoveMeal={(day, meal) => handleAddToMenu(null, day, meal)}
                    onViewRecipe={setSelectedRecipe}
                    onAddToMenu={handleAddToMenu}
                    activeMenu={null}
                  />
                </div>
                <div className="md:hidden">
                  <MobileView
                    selectedDay={selectedDay}
                    weekDays={weekDays}
                    weeklyMenu={menu}
                    onDayChange={setSelectedDay}
                    onMealClick={handleMealClick}
                    onRemoveMeal={(day, meal) => handleAddToMenu(null, day, meal)}
                    onViewRecipe={setSelectedRecipe}
                    onAddToMenu={handleAddToMenu}
                    activeMenu={null}
                    onGenerateMenu={handleGenerateMenuClick}
                    onExport={() => handleExport(menu)}
                    onToggleHistory={() => setShowHistory(!showHistory)}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Menu History */}
        {showHistory && (
          <div className="mb-6">
            <MenuHistory
              history={menuHistory}
              onRestore={handleRestoreMenu}
              onHistoryChange={setMenuHistory}
              onMenuArchived={() => {}}
            />
          </div>
        )}

        {/* Registro de Actividades - Ahora al final del contenedor principal */}
        <div className="mt-8">
          <MenuActivityLog activities={menuActivities} />
        </div>
      </div>
    </>
  );
}

export default WeeklyMenu2;