import React, { useState } from 'react';
import { Clock, Users, ChefHat, Flame, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../types';
import { categoryColors } from '../../utils/categoryColors';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface RecipeCardProps {
  recipe: Recipe;
  favorites: string[];
  onClick?: () => void;
  onToggleFavorite?: () => void;
}

export function RecipeCard({ recipe, favorites, onToggleFavorite }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  
  const isFavorite = favorites?.includes(recipe.id);
  
  const colors = categoryColors[recipe.category as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100'
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);
  const handleCardClick = () => navigate(`/recipe/${recipe.id}`);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating) return;

    try {
      setIsAnimating(true);

      if (!isFavorite) {
        // Añadir a favoritos con confetti
        await onToggleFavorite?.();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        // Remover de favoritos con animación de corazón
        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            try {
              await onToggleFavorite?.();
              resolve();
            } catch (error) {
              console.error('Error removing favorite:', error);
              setIsAnimating(false);
            }
          }, 300);
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg 
                 transition-all transform hover:-translate-y-1 cursor-pointer 
                 overflow-hidden border border-rose-100/20"
      onClick={handleCardClick}
    >
      {/* Animación del corazón al quitar de favoritos */}
      <AnimatePresence>
        {isAnimating && isFavorite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.5, 1],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagen */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-rose-50 to-orange-50">
        {recipe.image_url && !imageError ? (
          <>
            <div 
              className={`absolute inset-0 bg-cover bg-center blur-lg scale-110 transition-opacity duration-300 ${
                imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${recipe.image_url}?quality=10&width=50)` }}
            />
            <img
              src={`${recipe.image_url}?quality=80&width=400`}
              alt={recipe.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={32} className="text-rose-300" />
          </div>
        )}

        {/* Botón de favorito */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          disabled={isAnimating}
          className={`
            absolute top-2 right-2 p-2 rounded-xl transition-all duration-200
            ${isFavorite 
              ? 'bg-white text-rose-500' 
              : 'bg-black/20 text-white hover:bg-black/30'
            }
            ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Heart 
            size={20} 
            className={`transition-all duration-200 ${
              isFavorite ? 'fill-current scale-110' : 'scale-100'
            }`}
          />
        </motion.button>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
            {recipe.name}
          </h3>
          {recipe.calories && (
            <div className="flex items-center space-x-1 bg-rose-50 px-2 py-1 rounded-lg ml-2">
              <Flame size={14} className="text-rose-500" />
              <span className="text-xs font-medium text-rose-600">{recipe.calories}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{recipe.prep_time || "30 min"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} shadow-sm`}>
            {recipe.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default RecipeCard;