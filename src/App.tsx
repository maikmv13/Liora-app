import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
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
import { Onboarding } from './components/Onboarding';
import { RecipeDetail } from './components/RecipeDetail';
import { LoadingFallback } from './components/LoadingFallback';
import { HealthTracker } from './components/HealthTracker';
import { HealthProvider } from './components/HealthTracker/contexts/HealthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HealthDashboard } from './components/HealthTracker/HealthDashboard';
import { WeightTracker } from './components/HealthTracker/WeightTracker';
import { ExerciseTracker } from './components/HealthTracker/ExerciseTracker';
import { HabitTracker } from './components/HealthTracker/HabitTracker';
import { NavigationDots } from './components/NavigationDots';

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

// Actualizar la interfaz de FavoriteRecipe
interface FavoriteRecipe extends Recipe {
  last_cooked: string;
  notes: string;
  rating: number;
  tags: string[];
}

const HEALTH_SECTIONS = [
  { id: 'health', label: 'Salud', gradient: 'from-violet-400 to-fuchsia-500' },
  { id: 'weight', label: 'Peso', gradient: 'from-rose-400 to-orange-500' },
  { id: 'exercise', label: 'Ejercicio', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'habits', label: 'Hábitos', gradient: 'from-amber-400 to-orange-500' }
];

// Componente que contiene el contenido de la app
function AppContent() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recetas');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { menuItems: activeMenuItems, loading: menuLoading } = useActiveMenu();
  const { shoppingList, toggleItem } = useShoppingList();
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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  
  // Get current health section from URL hash
  const healthSection = location.hash.slice(1) || 'health';

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
    const path = location.pathname.slice(1); // Remove leading slash
    if (path.startsWith('recipe/')) {
      setActiveTab('recetas');
    } else if (path === '') {
      setActiveTab('recetas');
    } else {
      setActiveTab(path);
    }
  }, [location.pathname]);

  // Touch and mouse events for lateral scroll
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      touchStartX.current = e.touches[0].clientX;
    } else {
      touchStartX.current = e.clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - touchStartX.current;
    setDragDistance(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = window.innerWidth * 0.2;
    const sections = HEALTH_SECTIONS.map(s => s.id);
    const currentIndex = sections.indexOf(healthSection);

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && currentIndex > 0) {
        window.location.hash = sections[currentIndex - 1];
      } else if (dragDistance < 0 && currentIndex < sections.length - 1) {
        window.location.hash = sections[currentIndex + 1];
      }
    }
    setDragDistance(0);
  };

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
        const favoriteRecipe = favorites.find(f => f.id === recipe.id);
        if (favoriteRecipe) {
          await removeFavorite(favoriteRecipe);
        }
      } else {
        const newFavorite: FavoriteRecipe = {
          ...recipe,
          last_cooked: '',
          notes: '',
          rating: 0,
          tags: []
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
        className="top-safe"
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
      />

      <main className={`container mx-auto pb-24 md:pb-8 ${
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
              path="/salud" 
              element={
                <HealthProvider>
                  <div className="min-h-screen">
                    <div className="max-w-6xl mx-auto space-y-6">
                      <div
                        ref={containerRef}
                        className="touch-pan-y"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseMove={handleTouchMove}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={healthSection}
                            initial={{ opacity: 0, x: dragDistance }}
                            animate={{ opacity: 1, x: dragDistance }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                              transform: `translateX(${dragDistance}px)`,
                              touchAction: 'pan-y'
                            }}
                          >
                            {healthSection === 'health' && <HealthDashboard />}
                            {healthSection === 'weight' && <WeightTracker />}
                            {healthSection === 'exercise' && <ExerciseTracker />}
                            {healthSection === 'habits' && <HabitTracker />}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <NavigationDots sections={HEALTH_SECTIONS} />
                    </div>
                  </div>
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