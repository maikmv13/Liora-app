import React, { useEffect, useState } from 'react';
import { ShoppingCart, Sparkles } from 'lucide-react';

interface ProgressProps {
  total: number;
  completed: number;
}

export function Progress({ total, completed }: ProgressProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const isComplete = progress === 100;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000); // Duración de la animación
    return () => clearTimeout(timer);
  }, [completed]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 shadow-lg">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm p-2 md:p-2.5 rounded-xl overflow-hidden">
                <div
                  className={`transform transition-transform duration-1000 ${
                    isAnimating ? 'translate-x-[200%]' : 'translate-x-0'
                  }`}
                >
                  <ShoppingCart 
                    size={20} 
                    className={`text-white md:w-6 md:h-6 transition-all duration-300 ${
                      isAnimating ? 'scale-90' : 'scale-100'
                    }`} 
                  />
                </div>
                {isAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingCart 
                      size={20} 
                      className="text-white md:w-6 md:h-6 transform -translate-x-[200%] animate-slide-cart" 
                    />
                  </div>
                )}
              </div>
              {isComplete && (
                <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base md:text-lg">
                Progreso de Compra
              </h3>
              <p className="text-sm md:text-base text-white/80 flex items-center space-x-1">
                <span>{completed}</span>
                <span className="text-white/60">/</span>
                <span>{total}</span>
                <span className="text-white/80">items completados</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="relative">
          <div className="w-full h-3 md:h-4 bg-black/20 backdrop-blur-sm rounded-full overflow-hidden">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/60 to-white/40 animate-shimmer"
              style={{
                width: `${progress}%`,
                backgroundSize: '200% 100%',
                transition: 'width 0.5s ease-in-out'
              }}
            />
            {/* Shine effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                width: `${progress}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <div className="animate-bounce">
              ✨
            </div>
          </div>
        )}
      </div>
    </div>
  );
}