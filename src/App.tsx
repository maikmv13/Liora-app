/**
 * NOTA IMPORTANTE: Se han corregido los principales problemas de tipos después de eliminar
 * el módulo HealthTracker. Se han realizado las siguientes mejoras:
 *  - types.ts: 
 *    - MenuItem ahora incluye 'day'
 *    - Recipe permite calories como string o number
 *    - FavoriteRecipe tiene una definición unificada
 *  - Eliminadas definiciones duplicadas de FavoriteRecipe en types/index.ts y types/recipe.ts
 *  - useFavorites.ts: Actualizado para usar la definición unificada de FavoriteRecipe
 *  - useRequiredFavorites.ts: Actualizado para usar la definición unificada y reemplazar notificaciones
 *  - RecipeContext.tsx: Interfaz actualizada
 *  - WeeklyMenu2/index.tsx: Añadida interfaz de props
 *  - Favorites/index.tsx: Componente ahora acepta props
 *  - useActiveMenu.ts: Firma corregida
 * 
 * TODO: Seguir con el plan de refactorización para resolver problemas de tipos restantes:
 * 1. Revisar componentes que utilizan FavoriteRecipe (RecipeDetail, RecipeCard)
 * 2. Limpiar los 'as any' restantes
 * 3. Revisar los hooks personalizados para asegurar consistencia
 * 4. Restaurar la estricticidad en tsconfig.app.json
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Navigation } from './components/Navigation';
import { Profile } from './components/Profile';
import { MenuItem, Recipe, MealType, FavoriteRecipe } from './types';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useActiveMenu } from './hooks/useActiveMenu';
import { useShoppingList } from './hooks/useShoppingList';
import { useRecipes } from './hooks/useRecipes';
import { useFavorites } from './hooks/useFavorites';
import { MobileInstallButton } from './components/MobileInstallButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { Onboarding } from './components/Onboarding';
import { RecipeDetail } from './components/RecipeDetail';
import { LoadingFallback } from './components/LoadingFallback';
import { Copyright, Calendar, ChefHat, ShoppingCart } from 'lucide-react';

// Lazy load components
const WeeklyMenu2 = lazy(() => import('./components/WeeklyMenu2'));
const Favorites = lazy(() => import('./components/Favorites'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));
const RecipeContent = lazy(() => import('./components/RecipeList/RecipeContext'));
const LioraChat = lazy(() => import('./components/LioraChat'));

// Actualizar la interfaz de RecipeContentProps
interface RecipeContentProps {
  loading: boolean;
  error: Error | null;
  recipes: Recipe[];
  onRecipeSelect: () => void;
  favorites: string[];
  onToggleFavorite: (recipe: Recipe) => Promise<void>;
  loadingFallback: () => JSX.Element;
}

// Actualizar la definición de MenuItem para incluir el día
interface AppMenuItem extends MenuItem {
  day: string;
}

// Componente que contiene el contenido de la app
function AppContent() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recetas');
  const [weeklyMenu, setWeeklyMenu] = useState<AppMenuItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const { menuItems: activeMenuItems, loading: menuLoading } = useActiveMenu();
  const { shoppingList, toggleItem } = useShoppingList();
  const { recipes, loading: recipesLoading } = useRecipes();
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
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
      // Convertir los elementos a AppMenuItem explícitamente
      const typedMenuItems = activeMenuItems.map(item => {
        return {
          ...item,
          day: item.day || ''
        } as AppMenuItem;
      });
      setWeeklyMenu(typedMenuItems);
    }
  }, [activeMenuItems, menuLoading, user]);

  // Actualizar activeTab basado en la ruta actual
  useEffect(() => {
    const path = location.pathname.slice(1); // Remove leading slash
    if (path.startsWith('recipe/')) {
      setActiveTab('recetas');
    } else if (path === '') {
      setActiveTab('menu');
    } else {
      setActiveTab(path);
    }
  }, [location.pathname]);

  // Modificar handleAddToMenu para usar AppMenuItem
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
      const isFavorite = favorites.some(fav => fav.recipe_id === recipe.id);
      
      if (isFavorite) {
        const favoriteRecipe = favorites.find(f => f.recipe_id === recipe.id);
        if (favoriteRecipe) {
          await removeFavorite(favoriteRecipe);
        }
      } else {
        const newFavorite = {
          user_id: user.id,
          recipe_id: recipe.id,
          notes: null,
          last_cooked: null,
          tags: [],
          rating: 0
        };
        await addFavorite(newFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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

  // Función placeholder para updateFavorite
  const updateFavorite = async (favorite: FavoriteRecipe) => {
    console.log('Updating favorite:', favorite);
    // Implementar lógica real aquí
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-rose-50 to-orange-50 relative pt-safe">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        user={user}
        onLogin={() => setOnboardingCompleted(false)}
        onProfile={() => setActiveTab('profile')}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className={`container mx-auto pb-8 ${
        location.pathname.startsWith('/recipe/') ? 'pt-safe' : 'px-4 pt-20'
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
                  loadingFallback={LoadingFallback}
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
              path="/liora" 
              element={<LioraChat />} 
            />
            <Route path="/" element={<Navigate to="/menu" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer minimalista */}
      <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-rose-100/20 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2">
          <span>Liora</span>
          <Copyright size={14} className="text-rose-400" />
          <span>{new Date().getFullYear()}</span>
        </div>
      </footer>

      <MobileInstallButton />
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