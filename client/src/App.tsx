import React, { useState, useEffect } from 'react';
import { Recipe, MenuItem, ShoppingItem, FavoriteRecipe } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { RecipeList } from './components/RecipeList';
import { RecipeModal } from './components/RecipeModal';
import { WeeklyMenu2 as WeeklyMenu } from './components/WeeklyMenu2';
import { ShoppingList } from './components/ShoppingList';
import { Favorites } from './components/Favorites';
import { WeightTracker } from './components/WeightTracker';
import { HealthyPlateGuide } from './components/HealthyPlateGuide';
import { Login } from './components/Login';
import { sampleRecipes } from './data/recipes';
import { categorizeIngredient } from './utils/categorizeIngredient';
import { getUnitPlural } from './utils/getUnitPlural';

function App() {
  const [activeTab, setActiveTab] = useState('recetas');
  const [searchTerm, setSearchTerm] = useState('');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddToMenuFromModal = (recipe: Recipe) => {
    addToMenu(recipe, 'Lunes', 'comida');
    setSelectedRecipe(null);
    setActiveTab('menu');
  };

  const addToMenu = (recipe: Recipe | null, day: string, meal: 'comida' | 'cena') => {
    setWeeklyMenu(prev => {
      if (recipe === null) {
        return prev.filter(item => !(item.day === day && item.meal === meal));
      }
      const filtered = prev.filter(item => !(item.day === day && item.meal === meal));
      return [...filtered, { recipe, day, meal }];
    });
  };

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.Plato === recipe.Plato);
      if (isFavorite) {
        return prev.filter(fav => fav.Plato !== recipe.Plato);
      } else {
        const newFavorite: FavoriteRecipe = {
          ...recipe,
          addedAt: new Date().toISOString(),
          rating: 0
        };
        return [...prev, newFavorite];
      }
    });
  };

  const updateFavorite = (updatedRecipe: FavoriteRecipe) => {
    setFavorites(prev => 
      prev.map(recipe => 
        recipe.Plato === updatedRecipe.Plato ? updatedRecipe : recipe
      )
    );
  };

  const toggleShoppingItem = (nombre: string, dia?: string) => {
    setShoppingItems(prev => {
      const newItems = prev.map(item => {
        if (item.nombre === nombre) {
          if (dia) {
            if (item.dias.includes(dia)) {
              return { ...item, comprado: !item.comprado };
            }
          } else {
            return { ...item, comprado: !item.comprado };
          }
        }
        return item;
      });
      return newItems;
    });
  };

  useEffect(() => {
    const getShoppingList = () => {
      const ingredients = new Map<string, ShoppingItem>();
      
      weeklyMenu.forEach(({ recipe, day }) => {
        recipe.Ingredientes.forEach(ing => {
          const key = ing.Nombre;
          const current = ingredients.get(key);
          
          if (current) {
            if (current.unidad === ing.Unidad) {
              current.cantidad += ing.Cantidad;
              if (!current.dias.includes(day)) {
                current.dias.push(day);
              }
            }
          } else {
            ingredients.set(key, { 
              nombre: ing.Nombre,
              cantidad: ing.Cantidad,
              unidad: ing.Unidad,
              categoria: categorizeIngredient(ing.Nombre),
              comprado: false,
              dias: [day]
            });
          }
        });
      });

      return Array.from(ingredients.values()).map(item => ({
        ...item,
        unidad: getUnitPlural(item.unidad, item.cantidad)
      }));
    };

    const newItems = getShoppingList();
    setShoppingItems(newItems.map(newItem => {
      const existingItem = shoppingItems.find(item => item.nombre === newItem.nombre);
      return existingItem ? { ...newItem, comprado: existingItem.comprado } : newItem;
    }));
  }, [weeklyMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogin={() => setShowLogin(true)}
      />
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'recetas' && (
          <RecipeList 
            recipes={sampleRecipes}
            onRecipeSelect={handleRecipeSelect}
            favorites={favorites.map(f => f.Plato)}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'menu' && (
          <WeeklyMenu 
            weeklyMenu={weeklyMenu}
            onRecipeSelect={handleRecipeSelect}
            onAddToMenu={addToMenu}
          />
        )}

        {activeTab === 'compra' && (
          <ShoppingList 
            items={shoppingItems}
            onToggleItem={toggleShoppingItem}
          />
        )}

        {activeTab === 'favoritos' && (
          <Favorites 
            favorites={favorites}
            onRemoveFavorite={(recipe) => toggleFavorite(recipe)}
            onUpdateFavorite={updateFavorite}
          />
        )}

        {activeTab === 'peso' && (
          <WeightTracker />
        )}

        {activeTab === 'plato' && (
          <HealthyPlateGuide />
        )}
      </main>

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={handleAddToMenuFromModal}
          isFavorite={favorites.some(f => f.Plato === selectedRecipe.Plato)}
          onToggleFavorite={() => toggleFavorite(selectedRecipe)}
        />
      )}

      {showLogin && (
        <Login onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default App;