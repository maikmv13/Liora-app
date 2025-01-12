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

interface WeeklyMenu2Props {
  readonly weeklyMenu: MenuItem[];
  readonly onRecipeSelect: (recipe: Recipe) => void;
  readonly onAddToMenu: (recipe: Recipe | null, day: string, meal: 'comida' | 'cena') => void;
}

interface MenuHistory {
  id: string;
  date: string;
  menu: MenuItem[];
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
type WeekDay = typeof DAYS[number];

export function WeeklyMenu2({ weeklyMenu, onRecipeSelect, onAddToMenu }: WeeklyMenu2Props) {
  const { recipes, loading } = useRecipes();
  const [selectedDay, setSelectedDay] = useState<WeekDay>('Lunes');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: 'comida' | 'cena';
  } | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<MenuItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(
    localStorage.getItem('lastMenuGenerated')
  );
  const [menuHistory, setMenuHistory] = useState<MenuHistory[]>(() => {
    const saved = localStorage.getItem('menuHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
  }, [menuHistory]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleMealClick = (day: string, meal: 'comida' | 'cena') => {
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

  const handleRemoveMeal = (day: string, meal: 'comida' | 'cena') => {
    onAddToMenu(null, day, meal);
  };

  const handleViewRecipe = (menuItem: MenuItem) => {
    setViewingRecipe(menuItem);
  };

  const handleGenerateMenu = async () => {
    if (isGenerating || loading) return;
    
    // Guardar el menú actual en el historial
    if (weeklyMenu.length > 0) {
      const newHistoryEntry: MenuHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        menu: [...weeklyMenu]
      };
      setMenuHistory(prev => [newHistoryEntry, ...prev]);
    }
    
    setIsGenerating(true);
    try {
      // Limpiar el menú actual completamente
      weekDays.forEach(day => {
        ['comida', 'cena'].forEach(meal => {
          onAddToMenu(null, day, meal as 'comida' | 'cena');
        });
      });

      // Esperar un momento para que se limpie
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mantener un registro de las recetas ya seleccionadas
      const selectedRecipeIds = new Set<string>();
      
      // Generar nuevo menú
      for (const day of weekDays) {
        for (const meal of ['comida', 'cena'] as const) {
          const validRecipes = recipes.filter((recipe: Recipe) => {
            const isValidForMeal = meal === 'comida' 
              ? ['Aves', 'Carnes', 'Pastas y Arroces', 'Pescados', 'Legumbres'].includes(recipe.category)
              : ['Ensaladas', 'Sopas y Cremas', 'Vegetariano', 'Pastas y Arroces'].includes(recipe.category);
            
            // Evitar repetir recetas usando el Set
            const isNotRepeated = !selectedRecipeIds.has(recipe.id);
            
            return isValidForMeal && isNotRepeated;
          });
          
          if (validRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * validRecipes.length);
            const selectedRecipe = validRecipes[randomIndex];
            // Añadir el ID al Set de recetas seleccionadas
            selectedRecipeIds.add(selectedRecipe.id);
            await new Promise(resolve => setTimeout(resolve, 50));
            onAddToMenu(selectedRecipe, day, meal);
          }
        }
      }
    } finally {
      setIsGenerating(false);
      localStorage.setItem('lastMenuGenerated', new Date().toISOString());
      setLastGenerated(new Date().toISOString());
    }
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

  const handleRestoreMenu = async (menu: MenuItem[]) => {
    // Limpiar el menú actual
    for (const day of weekDays) {
      for (const meal of ['comida', 'cena'] as const) {
        onAddToMenu(null, day, meal);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    // Restaurar el menú del historial
    for (const item of menu) {
      onAddToMenu(item.recipe, item.day, item.meal as 'comida' | 'cena');
      await new Promise(resolve => setTimeout(resolve, 50));
    }
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

      <MenuHistory
        history={menuHistory}
        onRestore={handleRestoreMenu}
        onDelete={(id) => setMenuHistory(prev => prev.filter(menu => menu.id !== id))}
      />

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