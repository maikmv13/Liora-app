import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { MobileInstallButton } from './components/MobileInstallButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { ChefHat, Leaf, Sparkles } from 'lucide-react';
import { FloatingChatButton } from './components/FloatingChatButton';
import { HealthyPlateGuide } from './components/HealthyPlateGuide';
import { Onboarding } from './components/Onboarding';
import { RecipeDetail } from './components/RecipeDetail';

// Lazy load components
const WeeklyMenu2 = lazy(() => import('./components/WeeklyMenu2'));
const Favorites = lazy(() => import('./components/Favorites'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));
const RecipeContent = lazy(() => import('./components/RecipeList/RecipeContext'));
const LioraChat = lazy(() => import('./components/LioraChat'));

// Nuevo componente que estará dentro del Router
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
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setOnboardingCompleted(true);
  };

  // Enhanced loading component with animation
  const LoadingFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Logo container with pulsing background */}
        <div className="relative">
          <div className="absolute inset-0 bg-rose-200/20 rounded-2xl blur-xl animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-rose-100">
            <div className="relative">
              <ChefHat size={48} className="text-rose-500 animate-bounce" />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1.5 shadow-sm">
                <Sparkles size={12} className="text-rose-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 bg-orange-100/50 w-8 h-8 rounded-full blur-sm animate-pulse" />
        <div className="absolute -bottom-4 -left-4 bg-purple-100/50 w-8 h-8 rounded-full blur-sm animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Preparando tu experiencia...
        </h2>
        <p className="text-gray-500 mt-2 animate-pulse">
          Cargando ingredientes mágicos 🌟
        </p>
      </div>

      {/* Loading progress */}
      <div className="mt-6 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user && !onboardingCompleted) {
    return (
      <Router>
        <Onboarding 
          onComplete={handleOnboardingComplete}
          onLogin={() => {}}
        />
      </Router>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 relative">
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
        location.pathname.startsWith('/recipe/') 
          ? '' 
          : 'px-4 pt-20'
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
              element={<HealthyPlateGuide />} 
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