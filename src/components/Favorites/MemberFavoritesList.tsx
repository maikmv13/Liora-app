import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronRight, User, ChevronLeft } from 'lucide-react';
import type { FavoriteRecipe } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface MemberFavoritesListProps {
  favorites: FavoriteRecipe[];
  onUpdateFavorite: (recipe: FavoriteRecipe) => Promise<void>;
}

export function MemberFavoritesList({ favorites, onUpdateFavorite }: MemberFavoritesListProps) {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Agrupar recetas por miembro
  const recipesByMember = favorites.reduce((acc, recipe) => {
    const memberName = recipe.member_name || 'Desconocido';
    if (!acc[memberName]) {
      acc[memberName] = [];
    }
    acc[memberName].push(recipe);
    return acc;
  }, {} as Record<string, FavoriteRecipe[]>);

  // Seleccionar automáticamente el primer miembro al cargar
  useEffect(() => {
    const members = Object.keys(recipesByMember);
    if (members.length > 0 && !selectedMember) {
      setSelectedMember(members[0]);
    }
  }, [recipesByMember]);

  // Comprobar si se puede hacer scroll
  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Añadir listener de scroll
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      checkScroll();
      tabsElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        tabsElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Función para hacer scroll
  const scroll = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? tabsRef.current.scrollLeft - scrollAmount
        : tabsRef.current.scrollLeft + scrollAmount;
      
      tabsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  if (Object.keys(recipesByMember).length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
        <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-rose-500" />
        </div>
        <p className="text-gray-900 font-medium">
          No hay recetas favoritas de otros miembros
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Tabs Navigation with Scroll Buttons */}
      <div className="relative border-b border-rose-100/20">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-white via-white/90 to-transparent"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
        )}

        {/* Tabs Container */}
        <div
          ref={tabsRef}
          className="flex overflow-x-auto scrollbar-hide mx-8"
        >
          {Object.keys(recipesByMember).map((memberName) => (
            <motion.button
              key={memberName}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMember(
                selectedMember === memberName ? null : memberName
              )}
              className={`
                flex items-center space-x-2 px-4 py-3 transition-all duration-200
                border-b-2 flex-none min-w-[120px]
                ${selectedMember === memberName
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                }
              `}
            >
              <div className={`
                p-1.5 rounded-lg transition-colors
                ${selectedMember === memberName
                  ? 'bg-rose-100'
                  : 'bg-gray-100'
                }
              `}>
                <User size={14} className={`
                  ${selectedMember === memberName
                    ? 'text-rose-500'
                    : 'text-gray-500'
                  }
                `} />
              </div>
              <span className="font-medium whitespace-nowrap">{memberName}</span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-white rounded-full">
                {recipesByMember[memberName].length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-white via-white/90 to-transparent"
          >
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="divide-y divide-rose-100/10">
        <AnimatePresence mode="wait">
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-rose-100/10"
            >
              {recipesByMember[selectedMember].map((recipe: FavoriteRecipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleRecipeClick(recipe.recipe_id)}
                  className="flex items-center justify-between p-4 hover:bg-rose-50/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {recipe.image_url && (
                      <img 
                        src={recipe.image_url} 
                        alt={recipe.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                        {recipe.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {recipe.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedMember && (
          <div className="p-8 text-center text-gray-500">
            <p>Selecciona un miembro para ver sus recetas favoritas</p>
          </div>
        )}
      </div>
    </div>
  );
}