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

import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
// import { Onboarding } from './components/Onboarding';
import { RecipeDetail } from './components/RecipeDetail';
import { LoadingFallback } from './components/LoadingFallback';
import { Copyright } from 'lucide-react';

// Lazy load components
const WeeklyMenu2 = lazy(() => import('./components/WeeklyMenu2'));
const Favorites = lazy(() => import('./components/Favorites'));
const ShoppingList = lazy(() => import('./components/ShoppingList'));
const RecipeContent = lazy(() => import('./components/RecipeList/RecipeContext'));
const LioraChat = lazy(() => import('./components/LioraChat'));

// Actualizar la definición de MenuItem para incluir el día
interface AppMenuItem extends MenuItem {
  day: string;
}

// Componente que contiene el contenido de la app
function AppContent() {
  const location = useLocation();
  // const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recetas');
  const [weeklyMenu, setWeeklyMenu] = useState<AppMenuItem[]>([]);
  const [user, setUser] = useState<User | null>({ id: 'showcase-user' } as any);
  const [loading, setLoading] = useState(false);
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
  // const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  useEffect(() => {
    // Escuchar cambios de autenticación pero no sobreescribir si estamos en modo showcase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
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

  // Función placeholder para updateFavorite
  const updateFavorite = async (favorite: FavoriteRecipe) => {
    console.log('Updating favorite:', favorite);
  };

  return (
    <div className="h-full flex flex-col relative bg-gradient-to-br from-rose-50 to-orange-50 pt-safe overflow-hidden">
      <Header
        activeTab={activeTab}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${location.pathname.startsWith('/recipe/') ? '' : 'px-4 pt-20 pb-24'
        }`}>
        <div className="container mx-auto pb-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route
                path="/recetas"
                element={
                  <RecipeContent
                    loading={recipesLoading}
                    error={null}
                    recipes={recipes}
                    onRecipeSelect={() => { }}
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
                    onRecipeSelect={() => { }}
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
                  <Favorites
                    favorites={favorites}
                    onRemoveFavorite={removeFavorite}
                    onUpdateFavorite={updateFavorite}
                    loading={favoritesLoading}
                    error={favoritesError}
                  />
                }
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
              <Route
                path="/liora"
                element={<LioraChat />}
              />
              <Route path="/" element={<Navigate to="/recetas" replace />} />
            </Routes>
          </Suspense>
        </div>

        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-rose-100/20 bg-white/50 backdrop-blur-sm mt-auto">
          <div className="flex items-center justify-center space-x-2">
            <span>Liora</span>
            <Copyright size={14} className="text-rose-400" />
            <span>{new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>

      <MobileInstallButton />
    </div>
  );
}

// ─── PostMessage Bridge ──────────────────────────────────────────────────────
// Allows ATLAS (vizoso.io) to control this app inside an iframe via postMessage.
// Supported actions:
//   { action: 'click',    selector: '[data-filter="meal-type"][data-value="desayuno"]' }
//   { action: 'navigate', path: '/recetas' }
//   { action: 'scroll',   y: 300 }
//   { action: 'search',   term: 'pollo' }
const isAllowedOrigin = (origin: string) =>
  origin === 'https://vizoso.io' ||
  origin === 'https://www.vizoso.io' ||
  origin.startsWith('http://localhost'); // cualquier puerto local

function PostMessageBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    // ── Handshake: notify parent (ATLAS) that the bridge is active and ready ──
    window.parent.postMessage({ type: 'menuliora-ready' }, '*');
    console.log('[PostMessageBridge] Ready signal sent to parent ✅');

    const handler = (event: MessageEvent) => {
      // Debug: log everything that arrives so ATLAS can verify delivery
      console.log('[PostMessageBridge] Message received:', event.origin, event.data);

      // Security: only accept messages from ATLAS
      if (!isAllowedOrigin(event.origin)) {
        console.warn('[PostMessageBridge] Rejected origin:', event.origin);
        return;
      }

      const { action, selector, path, y, term } = event.data ?? {};
      console.log('[PostMessageBridge] Executing action:', action, event.data);

      switch (action) {
        case 'click': {
          if (selector) {
            const el = document.querySelector<HTMLElement>(selector);
            if (el) {
              el.click();
              console.log('[PostMessageBridge] Clicked:', selector);
            } else {
              console.warn('[PostMessageBridge] No element found for selector:', selector);
            }
          }
          break;
        }
        case 'navigate': {
          if (path) {
            navigate(path);
            console.log('[PostMessageBridge] Navigated to:', path);
          }
          break;
        }
        case 'scroll': {
          window.scrollTo({ top: y ?? 0, behavior: 'smooth' });
          break;
        }
        case 'search': {
          const input = document.querySelector<HTMLInputElement>('input[type="text"]');
          if (input) {
            const nativeInputSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype, 'value'
            )?.set;
            nativeInputSetter?.call(input, term ?? '');
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          break;
        }
        default:
          console.warn('[PostMessageBridge] Unknown action:', action);
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);

  return null;
}
// ────────────────────────────────────────────────────────────────────────────

// Componente principal que solo maneja el Router
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <PostMessageBridge />
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}

export default App;