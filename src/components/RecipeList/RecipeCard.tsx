import React, { useState } from 'react';
import { Clock, Users, ChefHat, Flame, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Recipe, FavoriteRecipe } from '../../types';
import { categoryColors } from '../../utils/categoryColors';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FavoriteAddedNotification } from './FavoriteAddedNotification';

interface RecipeCardProps {
  recipe: FavoriteRecipe;
  favorites?: string[];
  onToggleFavorite: () => void;
}

export function RecipeCard({ recipe, favorites, onToggleFavorite }: RecipeCardProps) {
  // Asegurarnos de que tenemos todos los datos necesarios
  if (!recipe?.id || !recipe?.name) {
    console.warn('Recipe card received invalid data:', recipe);
    return null;
  }

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  
  const isFavorite = favorites?.includes(recipe.favorite_id || '');
  
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
        setShowNotification(true);
        await onToggleFavorite();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#fda4af']
        });
      } else {
        setIsRemoving(true);
        await onToggleFavorite();
      }

      setTimeout(() => {
        setIsAnimating(false);
        setIsRemoving(false);
      }, 1000);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setShowNotification(false);
      setIsRemoving(false);
      setIsAnimating(false);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  };

  return (
    <>
      <AnimatePresence>
        {showNotification && !isRemoving && (
          <FavoriteAddedNotification
            recipeName={recipe.name}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm 
                   transition-all duration-700 transform hover:-translate-y-1 cursor-pointer 
                   overflow-hidden border border-rose-100/20
                   ${isRemoving ? 'scale-95 opacity-30' : ''}`}
        onClick={handleCardClick}
      >
        {/* Animación del corazón al quitar de favoritos */}
        <AnimatePresence>
          {isRemoving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ 
                  scale: [1, 1.5, 0.5],
                  opacity: [1, 1, 0],
                  rotate: [0, 0, 45]
                }}
                transition={{ 
                  duration: 0.8,
                  times: [0, 0.5, 1],
                  ease: "easeInOut"
                }}
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

          {/* Botón de favorito mejorado */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            disabled={isAnimating}
            className={`
              absolute top-2 right-2 p-2 rounded-xl transition-all duration-500
              ${isFavorite 
                ? 'bg-rose-500 shadow-lg text-white'
                : 'bg-black/20 text-white hover:bg-rose-500 hover:text-white'
              }
              ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <motion.div
              animate={isFavorite ? {
                scale: [1, 1.2, 1],
                rotate: [0, -15, 15, 0],
              } : {}}
              transition={{
                duration: 0.7,
                ease: "easeInOut"
              }}
            >
              <Heart 
                size={20} 
                className={`transition-all duration-500 transform
                  ${isFavorite ? 'fill-current scale-110' : 'scale-100'}
                `}
              />
            </motion.div>
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
    </>
  );
}

export default RecipeCard;