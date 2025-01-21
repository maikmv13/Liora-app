import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Apple, Brain, Heart, Sparkles, ArrowRight, Check } from 'lucide-react';
import { ScreenProps } from './types';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  emoji: string;
  details: string;
  funFact?: string;
}

const features: Feature[] = [
  {
    id: 'nutrition',
    title: 'Nutrición',
    description: 'Consejos personalizados',
    icon: Heart,
    color: 'rose',
    emoji: '🥗',
    details: 'Recibe consejos nutricionales personalizados y aprende a mantener una dieta equilibrada.',
    funFact: '¿Sabías que los alimentos orgánicos pueden mejorar tu salud?'
  },
  {
    id: 'planning',
    title: 'Planificación',
    description: 'Organiza tus comidas',
    icon: Calendar,
    color: 'orange',
    emoji: '📅',
    details: 'Planifica tus comidas semanales y organiza tu lista de compras automáticamente.',
    funFact: '¿Sabías que la planificación puede reducir el estrés y mejorar tu productividad?'
  },
  {
    id: 'recipes',
    title: 'Recetas',
    description: 'Platos saludables',
    icon: Apple,
    color: 'emerald',
    emoji: '👩‍🍳',
    details: 'Descubre cientos de recetas saludables y aprende a cocinar platos deliciosos.',
    funFact: '¿Sabías que la cocina puede ser una actividad relajante?'
  },
  {
    id: 'ai',
    title: 'Asistente IA',
    description: 'Ayuda 24/7',
    icon: Brain,
    color: 'purple',
    emoji: '🤖',
    details: 'Cuenta con un asistente personal que te ayudará a resolver todas tus dudas.',
    funFact: '¿Sabías que la IA puede ayudar a mejorar tu productividad?'
  }
];

// Componente de confeti mejorado
const FallingConfetti = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {isActive && [...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            top: "-20%",
            left: `${Math.random() * 100}%`,
            scale: 0,
            rotate: 0
          }}
          animate={{
            top: "120%",
            scale: [0, 1, 1, 0.5],
            rotate: 360
          }}
          transition={{
            duration: Math.random() * 2.5 + 2.5,
            repeat: 0, // Sin repetición
            ease: "linear",
            delay: Math.random() * 2
          }}
          className={`
            absolute w-4 h-4
            ${[
              'bg-rose-500',
              'bg-pink-500',
              'bg-orange-400',
              'bg-purple-500',
              'bg-yellow-400',
              'bg-emerald-400'
            ][Math.floor(Math.random() * 6)]}
            ${Math.random() > 0.5 ? 'rounded-full' : 'rotate-45'}
          `}
        />
      ))}
    </div>
  );
};

export function FeaturesScreen({ onNext }: ScreenProps) {
  const [showButton, setShowButton] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [checkedFeatures, setCheckedFeatures] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (checkedFeatures.size === features.length) {
      setShowConfetti(true);
      // Mantener el confeti por más tiempo
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [checkedFeatures]);

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    if (!checkedFeatures.has(featureId)) {
      setCheckedFeatures(prev => new Set([...prev, featureId]));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FallingConfetti isActive={showConfetti} />
      
      <div className="flex-1 px-4 py-8 md:py-12 max-w-lg mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1.5"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                Descubre Liora ✨
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-2">
              Aprende a cómo vivir estable en una balanza!
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 mb-6">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(checkedFeatures.size / features.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {checkedFeatures.size} de {features.length} características descubiertas
          </p>
        </div>

        {/* Features Grid - Cards más grandes */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-24">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleFeatureClick(feature.id)}
              className={`
                bg-white/80 backdrop-blur-sm rounded-xl p-6 border
                shadow-sm transform transition-all duration-300 hover:scale-105 active:scale-95
                cursor-pointer relative overflow-hidden group min-h-[180px]
                ${checkedFeatures.has(feature.id) 
                  ? 'border-green-200 bg-green-50/50' 
                  : `border-${feature.color}-100`}
              `}
            >
              {checkedFeatures.has(feature.id) && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`p-3 rounded-xl ${
                  checkedFeatures.has(feature.id) 
                    ? 'bg-green-100' 
                    : `bg-${feature.color}-50`
                } mb-3 group-hover:scale-110 transition-transform`}>
                  <feature.icon 
                    size={20} 
                    className={checkedFeatures.has(feature.id) 
                      ? 'text-green-500' 
                      : `text-${feature.color}-500`
                    } 
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {feature.title} {feature.emoji}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feature Details Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {(() => {
                const feature = features.find(f => f.id === selectedFeature)!;
                return (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500" />
                    <div className="flex items-start space-x-4 mb-6">
                      <div className={`p-4 rounded-2xl bg-${feature.color}-50 flex-shrink-0`}>
                        <feature.icon size={32} className={`text-${feature.color}-500`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {feature.title} {feature.emoji}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {feature.details}
                      </p>
                      <div className="bg-rose-50 rounded-xl p-4">
                        <h4 className="font-medium text-rose-700 mb-2">
                          ¿Sabías que?
                        </h4>
                        <p className="text-sm text-rose-600">
                          {feature.funFact || "Próximamente más información sobre esta característica..."}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFeature(null)}
                      className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                    >
                      ¡Entendido!
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button - Siempre visible después del timeout inicial */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="fixed bottom-16 md:bottom-20 left-4 right-4 md:left-auto md:right-auto md:w-full max-w-sm mx-auto"
          >
            <button
              onClick={onNext}
              className={`
                w-full px-8 py-5 bg-gradient-to-r from-rose-500 to-pink-500 
                text-white rounded-xl font-medium shadow-lg hover:shadow-xl 
                active:scale-95 transition-all duration-300
                ${checkedFeatures.size === features.length ? 'animate-pulse' : ''}
              `}
            >
              <span className="flex items-center justify-center">
                <span>Continuar</span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [-4, 4, -4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}