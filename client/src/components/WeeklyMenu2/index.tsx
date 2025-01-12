import React, { useState, useEffect } from 'react';
import type { Recipe, MenuItem, MealType } from '../../types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';
import { RecipeModal } from '../RecipeModal';
import { MenuHistory } from './MenuHistory';
import { weekDays } from './utils';
import { Calendar, Wand2, Share2, Loader2 } from 'lucide-react';
import { useRecipes } from '../../hooks/useRecipes';
import { mapRecipeToCardProps } from '../RecipeCard';
import { generateCompleteMenu } from '../../services/menuGenerator';
import { archiveMenu, createWeeklyMenu, getActiveMenu } from '../../services/weeklyMenu';

interface WeeklyMenu2Props {
  readonly weeklyMenu: MenuItem[];
  readonly onRecipeSelect: (recipe: Recipe) => void;
  readonly onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void;
  readonly forUserId?: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
type WeekDay = typeof DAYS[number];

export function WeeklyMenu2({ weeklyMenu, onRecipeSelect, onAddToMenu, forUserId }: WeeklyMenu2Props) {
  const { recipes, loading } = useRecipes();
  const [selectedDay, setSelectedDay] = useState<WeekDay>('Lunes');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: MealType;
  } | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<MenuItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(
    localStorage.getItem('lastMenuGenerated')
  );
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);

  // Cargar el menú activo al iniciar
  useEffect(() => {
    const loadActiveMenu = async () => {
      try {
        const activeMenu = await getActiveMenu(forUserId);
        if (activeMenu) {
          setCurrentMenuId(activeMenu.id);
          // Restaurar el menú activo
          activeMenu.menu_items.forEach(item => {
            onAddToMenu(item.recipe, item.day, item.meal);
          });
        }
      } catch (error) {
        console.error('Error al cargar el menú activo:', error);
      }
    };

    loadActiveMenu();
  }, [forUserId]);

  const handleMealClick = (day: string, meal: MealType) => {
    setSelectedMealInfo({ day, meal });
    setSidebarOpen(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (selectedMealInfo) {
      onAddToMenu(recipe, selectedMealInfo.day, selectedMealInfo.meal);
      setSidebarOpen(false);
      setSelectedMealInfo(null);
    }
  };

  const handleRemoveMeal = (day: string, meal: MealType) => {
    console.log('Removing meal in WeeklyMenu2:', { day, meal });
    // Limpiar explícitamente el menú
    const updatedMenu = weeklyMenu.filter(
      item => !(item.day === day && item.meal === meal)
    );
    // Llamar a onAddToMenu con null para eliminar
    onAddToMenu(null, day, meal);
  };

  const handleViewRecipe = (menuItem: MenuItem) => {
    setViewingRecipe(menuItem);
  };

  const clearMenu = () => {
    weekDays.forEach(day => {
      ['desayuno', 'comida', 'snack', 'cena'].forEach(meal => {
        onAddToMenu(null, day, meal as MealType);
      });
    });
  };

  const handleGenerateMenu = async () => {
    if (isGenerating || loading) return;
    
    setIsGenerating(true);
    try {
      clearMenu();

      // Archivar el menú actual si existe
      if (currentMenuId) {
        await archiveMenu(currentMenuId);
      }

      // Generar y guardar nuevo menú
      const newMenu = await generateCompleteMenu(recipes);
      const savedMenu = await createWeeklyMenu(newMenu, forUserId);
      setCurrentMenuId(savedMenu.id);
      
      // Actualizar UI
      for (const menuItem of newMenu) {
        await new Promise(resolve => setTimeout(resolve, 50));
        onAddToMenu(menuItem.recipe, menuItem.day, menuItem.meal);
      }
    } finally {
      setIsGenerating(false);
      setLastGenerated(new Date().toISOString());
    }
  };

  const handleRestoreMenu = (menuItems: MenuItem[]) => {
    // Limpiar el menú actual
    weekDays.forEach(day => {
      ['comida', 'cena', 'desayuno', 'snack'].forEach(meal => {
        onAddToMenu(null, day, meal as MealType);
      });
    });
    
    // Restaurar el menú seleccionado
    menuItems.forEach(item => {
      onAddToMenu(item.recipe, item.day, item.meal);
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleExport = () => {
    const today = new Intl.DateTimeFormat('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());

    let menuContent = `🍽️ *Menú Semanal*\n📅 Generado el ${today}\n\n` + 
      weekDays.map(day => {
        const dayMenu = weeklyMenu.filter(item => item.day === day);
        const comida = dayMenu.find(item => item.meal === 'comida');
        const cena = dayMenu.find(item => item.meal === 'cena');
        
        return `*${day}*\n${comida ? `🍳 Comida: ${comida.recipe.name}\n` : ''}${cena ? `🌙 Cena: ${cena.recipe.name}\n` : ''}\n`;
      }).join('');

    const encodedMessage = encodeURIComponent(menuContent);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <Calendar size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Menú Semanal</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              📅 Planifica tus comidas para la semana
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleGenerateMenu}
            disabled={isGenerating || loading}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
              isGenerating || loading
                ? 'bg-rose-100 text-rose-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white hover:from-orange-500 hover:via-pink-600 hover:to-rose-600'
            }`}
          >
            {isGenerating || loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Wand2 size={20} />
            )}
            <span>{isGenerating || loading ? 'Generando...' : 'Generar Menú'}</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
          >
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {lastGenerated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-rose-50/50 px-3 py-2 rounded-lg">
          <Calendar size={16} className="text-rose-400" />
          <span>Último menú generado: {formatDate(new Date(lastGenerated))}</span>
        </div>
      )}

      <div className="hidden md:block">
        <DesktopView
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMeal}
          onViewRecipe={handleViewRecipe}
        />
      </div>
      
      <div className="md:hidden">
        <MobileView
          selectedDay={selectedDay}
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onDayChange={setSelectedDay}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMeal}
          onViewRecipe={handleViewRecipe}
        />
      </div>

      <MenuHistory onRestore={handleRestoreMenu} />

      {selectedMealInfo && (
        <RecipeSelectorSidebar
          isOpen={sidebarOpen}
          onClose={() => {
            setSidebarOpen(false);
            setSelectedMealInfo(null);
          }}
          onSelectRecipe={handleRecipeSelect}
          selectedDay={selectedMealInfo.day}
          selectedMeal={selectedMealInfo.meal}
        />
      )}

      {viewingRecipe && (
        <RecipeModal
          recipe={mapRecipeToCardProps(viewingRecipe.recipe)}
          onClose={() => setViewingRecipe(null)}
          onAddToMenu={() => {}}
        />
      )}
    </div>
  );
}