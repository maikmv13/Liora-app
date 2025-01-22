import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Navigation } from './components/Navigation';
import { Profile } from './components/Profile';
import { MenuItem, Recipe, MealType } from './types';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useActiveMenu } from './hooks/useActiveMenu';
import { useShoppingList } from './hooks/useShoppingList';
import { useRecipes } from './hooks/useRecipes';
import { useFavorites } from './hooks/useFavorites';
import { MobileInstallButton } from './components/MobileInstallButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingChatButton } from './components/FloatingChatButton';
import { Onboarding } from './components/Onboarding';
import { RecipeDetail } from './components/RecipeDetail';
import { LoadingFallback } from './components/LoadingFallback';
import { HealthTracker } from './components/HealthTracker';
import { HealthProvider } from './contexts/HealthContext';

// Lazy load components
const WeeklyMenu2 = lazy(() => import('./components/WeeklyMenu2'));
const Favorites = lazy(() => import('./components/Favorites'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));
const RecipeContent = lazy(() => import('./components/RecipeList/RecipeContext'));
const LioraChat = lazy(() => import('./components/LioraChat'));

// Componente que contiene el contenido de la app
function AppContent() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recetas');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem('onboardingCompleted') === 'true';
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!menuLoading && activeMenuItems.length > 0 && user) {
      setWeeklyMenu(activeMenuItems);
    }
  }, [activeMenuItems, menuLoading, user]);

  // Actualizar activeTab basado en la ruta actual
  useEffect(() => {
    const getActiveTab = () => {
      const path = location.pathname;
      
      switch (path) {
        case '/recetas':
          return 'recetas';
        case '/favoritos':
          return 'favoritos';
        case '/menu':
          return 'menu';
        case '/compra':
          return 'compra';
        case '/salud':
          return 'salud';
        case '/profile':
          return 'profile';
        case path.match(/^\/recipe\//)?.input:
          return 'recetas';
        default:
          return 'recetas';
      }
    };

    const newTab = getActiveTab();
    setActiveTab(newTab);
  }, [location.pathname]);

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
      setOnboardingCompleted(false);
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
      // Aquí podrías mostrar un mensaje de error al usuario
      // Por ejemplo, usando un toast o un mensaje en la UI
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setOnboardingCompleted(true);
  };

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user && !onboardingCompleted) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete}
        onLogin={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 relative">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogin={() => setOnboardingCompleted(false)}
        user={user}
        onProfile={() => setActiveTab('profile')}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
      />

      <main className={`container mx-auto pb-24 md:pb-8 ${
        location.pathname.startsWith('/recipe/') ? '' : 'px-4 pt-20'
      }`}>
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
                  LoadingFallback={LoadingFallback}
                />
              } 
            />
            <Route 
              path="/recipe/:id" 
              element={
                <RecipeDetail 
                  recipes={recipes}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
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
              path="/salud" 
              element={
                <HealthProvider>
                  <HealthTracker />
                </HealthProvider>
              } 
            />
            <Route 
              path="/liora" 
              element={<LioraChat />} 
            />
            <Route path="/" element={<Navigate to="/recetas" replace />} />
          </Routes>
        </Suspense>
      </main>

      <MobileInstallButton />
      <FloatingChatButton />
    </div>
  );
}

// Componente principal que solo maneja el Router
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}

export default App;