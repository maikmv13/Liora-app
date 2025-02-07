import React, { useState } from 'react';
import { ChefHat, Flame, Heart, Share2, Image, X } from 'lucide-react';
import type { Recipe } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FavoriteAddedNotification } from '../../RecipeList/FavoriteAddedNotification';

interface HeroImageProps {
  recipe: Recipe;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function HeroImage({ recipe, onToggleFavorite, isFavorite }: HeroImageProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

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

      <div className="relative w-full aspect-[16/12]">
        {/* Animación del corazón al quitar de favoritos */}
        <AnimatePresence>
          {isRemoving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center"
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

        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ChefHat size={48} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />

        {/* Recipe Title and Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="leading-tight">
            <h1 className="text-2xl font-bold text-white inline">{recipe.name}</h1>
            
            {recipe.side_dish && (
              <span className="text-lg text-white/90"> {recipe.side_dish}</span>
            )}
          </div>

          {/* Primera línea: Categoría y Calorías */}
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
              <ChefHat size={14} />
              <span>{recipe.category}</span>
            </span>
            {recipe.calories && (
              <span className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
                <Flame size={14} />
                <span>{recipe.calories} kcal</span>
              </span>
            )}
          </div>
          
          {/* Segunda línea: Botones de acción */}
          <div className="flex items-center gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              disabled={isAnimating}
              className={`
                flex items-center space-x-1 px-2 py-1 backdrop-blur-sm rounded-lg transition-all duration-500
                ${isFavorite 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-white/20 text-white hover:bg-rose-500'
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
                  size={14} 
                  className={`transition-all duration-500 transform
                    ${isFavorite ? 'fill-current scale-110' : 'scale-100'}
                  `}
                />
              </motion.div>
              <span className="text-sm">
                {isFavorite ? 'Guardado' : 'Guardar'}
              </span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowImageModal(true)}
              className="flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-colors"
            >
              <Image size={14} />
              <span className="text-sm">Ver imagen</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                // Implement share functionality
              }}
              className="flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-colors"
            >
              <Share2 size={14} />
              <span className="text-sm">Compartir</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      <AnimatePresence>
        {showImageModal && (
          <>
            {/* Overlay - Aumentado el z-index a 60 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal - Aumentado el z-index a 61 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-[61] flex flex-col items-center justify-center"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Imagen */}
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="max-w-full max-h-[calc(100vh-2rem)] object-contain rounded-lg"
              />

              {/* Título de la receta */}
              <div className="absolute bottom-4 left-4 right-4 text-center bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                <h2 className="text-white font-medium text-lg">{recipe.name}</h2>
                {recipe.side_dish && (
                  <p className="text-white/70 text-sm mt-0.5 font-light">
                    {recipe.side_dish}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}