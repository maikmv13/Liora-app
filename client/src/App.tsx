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
import { supabase } from './lib/supabase';
import { useRecipes } from './hooks/useRecipes';
import { ChefHat } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { recipes, loading, error } = useRecipes();

  // Get active tab from current location
  const activeTab = location.pathname.split('/')[1] || 'recetas';

  // Auth state management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load favorites when user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const favoriteRecipes = data.map(fav => {
          const recipe = recipes.find(r => r.Plato === fav.recipe_id);
          if (!recipe) return null;
          
          return {
            ...recipe,
            addedAt: fav.created_at,
            notes: fav.notes,
            rating: fav.rating,
            lastCooked: fav.last_cooked,
            tags: fav.tags
          };
        }).filter(Boolean) as FavoriteRecipe[];

        setFavorites(favoriteRecipes);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    loadFavorites();
  }, [user, recipes]);

  const toggleFavorite = async (recipe: Recipe) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      const isFavorite = favorites.some(fav => fav.Plato === recipe.Plato);

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.Plato);

        if (error) throw error;

        setFavorites(prev => prev.filter(fav => fav.Plato !== recipe.Plato));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipe.Plato,
            created_at: new Date().toISOString()
          });

        if (error) throw error;

        const favoriteRecipe: FavoriteRecipe = {
          ...recipe,
          addedAt: new Date().toISOString(),
          rating: 0
        };

        setFavorites(prev => [...prev, favoriteRecipe]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Add to menu functions
  const addToMenu = (recipe: Recipe | null, day: string, meal: 'comida' | 'cena') => {
    setWeeklyMenu(prev => {
      if (recipe === null) {
        return prev.filter(item => !(item.day === day && item.meal === meal));
      }
      const filtered = prev.filter(item => !(item.day === day && item.meal === meal));
      return [...filtered, { recipe, day, meal }];
    });
  };

  const handleAddToMenuFromModal = (recipe: Recipe) => {
    addToMenu(recipe, 'Lunes', 'comida');
    setSelectedRecipe(null);
    navigate('/menu');
  };

  const handleRemoveFavorite = (recipe: FavoriteRecipe) => {
    setFavorites(prev => prev.filter(f => f.Plato !== recipe.Plato));
  };

  const handleUpdateFavorite = (recipe: FavoriteRecipe) => {
    setFavorites(prev => prev.map(f => f.Plato === recipe.Plato ? recipe : f));
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
              categoria: ing.Categoria || 'Otros',
              comprado: false,
              dias: [day]
            });
          }
        });
      });

      return Array.from(ingredients.values());
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
                <div className="text-center py-12">
                  <ChefHat size={32} className="mx-auto animate-spin text-rose-500" />
                  <p className="mt-4 text-gray-600">Cargando recetas...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>Error al cargar las recetas: {error.message}</p>
                </div>
              ) : recipes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No se encontraron recetas</p>
                </div>
              ) : (
                <RecipeList 
                  recipes={recipes}
                  onRecipeSelect={setSelectedRecipe}
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
                onRecipeSelect={setSelectedRecipe}
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
                onUpdateFavorite={handleUpdateFavorite}
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