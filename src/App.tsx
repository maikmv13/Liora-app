import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { MenuItem, Recipe, MealType } from './types';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useActiveMenu } from './hooks/useActiveMenu';
import { useShoppingList } from './hooks/useShoppingList';
import { useRecipes } from './hooks/useRecipes';
import { useFavorites } from './hooks/useFavorites';
import { HealthyPlateGuide } from './components/HealthyPlateGuide';
import { MobileInstallButton } from './components/MobileInstallButton';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load de componentes grandes
const WeeklyMenu2 = lazy(() => import('./components/WeeklyMenu2'));
const Favorites = lazy(() => import('./components/Favorites'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));
const RecipeContent = lazy(() => import('./components/RecipeList/RecipeContext'));

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recetas');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const { menuItems: activeMenuItems, loading: menuLoading } = useActiveMenu(user?.id);
  const { shoppingList, toggleItem } = useShoppingList(user?.id);
  const { recipes, loading: recipesLoading } = useRecipes();
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    updateFavorite,
    loading: favoritesLoading,
    error: favoritesError 
  } = useFavorites();

  useEffect(() => {
    if (!menuLoading && activeMenuItems.length > 0 && user) {
      setWeeklyMenu(activeMenuItems);
    }
  }, [activeMenuItems, menuLoading, user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToMenu = (recipe: Recipe | null, day: string, meal: MealType) => {
    if (recipe) {
      setWeeklyMenu(prev => {
        const filtered = prev.filter(item => !(item.day === day && item.meal === meal));
        return [...filtered, { recipe, day, meal }];
      });
    } else {
      setWeeklyMenu(prev => prev.filter(item => !(item.day === day && item.meal === meal)));
    }
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    try {
      const isFavorite = favorites.some(fav => fav.id === recipe.id);
      
      if (isFavorite) {
        await removeFavorite(recipe);
      } else {
        await addFavorite(recipe);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  // Componente de loading
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-600">Cargando...</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 relative">
          <Header
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogin={handleLogin}
            user={user}
            onProfile={() => setActiveTab('profile')}
          />

          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
          />

          <main className="container mx-auto px-4 pt-20 pb-24 md:pb-8">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route 
                  path="/recetas" 
                  element={
                    <RecipeContent
                      loading={recipesLoading}
                      error={null}
                      recipes={recipes}
                      onRecipeSelect={() => {}}
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
                      onRecipeSelect={() => {}}
                      onAddToMenu={handleAddToMenu}
                      forUserId={user?.id}
                    />
                  } 
                />
                <Route 
                  path="/compra" 
                  element={
                    <ShoppingList
                      items={shoppingList}
                      onToggleItem={toggleItem}
                    />
                  } 
                />
                <Route 
                  path="/favoritos" 
                  element={
                    user ? (
                      <Favorites
                        favorites={favorites}
                        onRemoveFavorite={removeFavorite}
                        onUpdateFavorite={updateFavorite}
                        loading={favoritesLoading}
                        error={favoritesError}
                      />
                    ) : (
                      <Navigate to="/menu" replace />
                    )
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    user ? (
                      <Profile />
                    ) : (
                      <Navigate to="/menu" replace />
                    )
                  } 
                />
                <Route 
                  path="/vida-sana" 
                  element={<HealthyPlateGuide />} 
                />
                <Route path="/" element={<Navigate to="/recetas" replace />} />
              </Routes>
            </Suspense>
          </main>

          {showLogin && (
            <Login
              onClose={() => setShowLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          <MobileInstallButton />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;