import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Recipe, MenuItem, ShoppingItem, MealType } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { RecipeModal } from './components/RecipeModal';
import { WeeklyMenu2 } from './components/WeeklyMenu2';
import { ShoppingList } from './components/ShoppingList';
import { Favorites } from './components/Favorites';
import { HealthyPlateGuide } from './components/HealthyPlateGuide';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { supabase } from './lib/supabase';
import { useRecipes } from './hooks/useRecipes';
import { useFavorites } from './hooks/useFavorites';
import { RecipeContent } from './components/RecipeList/RecipeContent';
import { mapRecipeToCardProps } from './components/RecipeCard';
import { HealthTracker } from './components/HealthTracker';
import { HealthProvider } from './components/context/HealthContext';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { recipes, loading: recipesLoading, error: recipesError } = useRecipes();
  const { 
    favorites, 
    loading: favoritesLoading, 
    addFavorite, 
    removeFavorite, 
    updateFavorite 
  } = useFavorites();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const isFavorite = favorites.some(fav => fav.id === recipe.id);
    if (isFavorite) {
      await removeFavorite(recipe);
    } else {
      await addFavorite(recipe);
    }
  };

  const handleAddToMenu = (recipe: Recipe | null, day: string, meal: MealType) => {
    if (recipe) {
      setWeeklyMenu(prev => [...prev, { recipe, day, meal }]);
    }
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={location.pathname.split('/')[1] || 'recetas'}
        onTabChange={(tab) => navigate(`/${tab}`)}
        onLogin={() => setShowLogin(true)}
        user={user}
        onProfile={() => navigate('/perfil')}
      />
      
      <Navigation 
        activeTab={location.pathname.split('/')[1] || 'recetas'}
        onTabChange={(tab) => navigate(`/${tab}`)}
      />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/recetas" replace />} />
          <Route 
            path="/recetas" 
            element={
              <RecipeContent
                loading={recipesLoading}
                error={recipesError}
                recipes={recipes}
                onRecipeSelect={setSelectedRecipe}
                favorites={favorites.map(f => f.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route 
            path="/menu" 
            element={
              <WeeklyMenu2 
                weeklyMenu={weeklyMenu}
                onRecipeSelect={setSelectedRecipe}
                onAddToMenu={handleAddToMenu}
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
                onRemoveFavorite={removeFavorite}
                onUpdateFavorite={updateFavorite}
              />
            }
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
          <Route 
            path="/salud" 
            element={
              <HealthProvider>
                <HealthTracker />
              </HealthProvider>
            }
          />
        </Routes>
      </main>

      {selectedRecipe && (
        <RecipeModal 
          recipe={mapRecipeToCardProps(selectedRecipe)}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={(recipe) => handleAddToMenu(recipe, 'Lunes', 'comida')}
          isFavorite={favorites.some(f => f.name === selectedRecipe.name)}
          onToggleFavorite={() => handleToggleFavorite(selectedRecipe)}
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