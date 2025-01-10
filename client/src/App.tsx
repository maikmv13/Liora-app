import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { Profile } from './components/Profile';
import { categorizeIngredient } from './utils/categorizeIngredient';
import { getUnitPlural } from './utils/getUnitPlural';
import { supabase } from './lib/supabase';
import { useRecipes } from './hooks/useRecipes';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { recipes, loading, error } = useRecipes();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddToMenuFromModal = (recipe: Recipe) => {
    addToMenu(recipe, 'Lunes', 'comida');
    setSelectedRecipe(null);
    navigate('/menu');
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

  const activeTab = location.pathname.split('/')[1] || 'recetas';

  const handleRemoveFavorite = (recipe: FavoriteRecipe) => {
    setFavorites(prev => prev.filter(f => f.Plato !== recipe.Plato));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={(tab) => navigate(`/${tab}`)}
        onLogin={() => setShowLogin(true)}
        user={user}
        onProfile={() => navigate('/perfil')}
      />
      <Navigation 
        activeTab={activeTab}
        onTabChange={(tab) => navigate(`/${tab}`)}
      />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/recetas" replace />} />
          <Route 
            path="/recetas" 
            element={
              loading ? (
                <div>Cargando...</div>
              ) : error ? (
                <div>Error: {error.message}</div>
              ) : (
                <RecipeList 
                  recipes={recipes}
                  onRecipeSelect={handleRecipeSelect}
                  favorites={favorites.map(f => f.Plato)}
                  onToggleFavorite={toggleFavorite}
                />
              )
            }
          />
          <Route 
            path="/menu" 
            element={
              <WeeklyMenu 
                weeklyMenu={weeklyMenu}
                onRecipeSelect={handleRecipeSelect}
                onAddToMenu={addToMenu}
              />
            }
          />
          <Route 
            path="/compra" 
            element={
              <ShoppingList 
                items={shoppingItems}
                onToggleItem={toggleShoppingItem}
              />
            }
          />
          <Route 
            path="/favoritos" 
            element={
              <Favorites 
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onUpdateFavorite={updateFavorite}
              />
            }
          />
          <Route 
            path="/peso" 
            element={<WeightTracker />}
          />
          <Route 
            path="/plato" 
            element={<HealthyPlateGuide />}
          />
          <Route 
            path="/perfil" 
            element={
              user ? <Profile /> : <Navigate to="/recetas" replace />
            }
          />
        </Routes>
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
        <Login 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={() => {
            setShowLogin(false);
            navigate('/perfil');
          }}
        />
      )}
    </div>
  );
}

export default App;