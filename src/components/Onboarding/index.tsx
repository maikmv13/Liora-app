import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { FeaturesScreen } from './screens/FeaturesScreen';
import { OnboardingLogin } from './screens/OnboardingLogin';

interface OnboardingProps {
  onComplete: () => void;
  onLogin: () => void;
}

export function Onboarding({ onComplete, onLogin }: OnboardingProps) {
  // Persistir el currentScreen en localStorage
  const [currentScreen, setCurrentScreen] = useState(() => {
    const saved = localStorage.getItem('onboardingScreen');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Guardar el currentScreen cada vez que cambie
  useEffect(() => {
    localStorage.setItem('onboardingScreen', currentScreen.toString());
  }, [currentScreen]);

  const SCREENS = [
    { id: 'welcome', Component: WelcomeScreen },
    { id: 'features', Component: FeaturesScreen },
    { id: 'login', Component: OnboardingLogin }
  ];

  const handleNext = () => {
    if (currentScreen < SCREENS.length - 1) {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  // Manejar la finalización del onboarding
  const handleComplete = () => {
    localStorage.removeItem('onboardingScreen'); // Limpiar el estado guardado
    onComplete();
  };

  // Manejar el login exitoso
  const handleLogin = () => {
    localStorage.removeItem('onboardingScreen'); // Limpiar el estado guardado
    onLogin();
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const { offset, velocity } = info;

    if (Math.abs(velocity.x) > 200) {
      if (velocity.x > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    } else if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentScreen(index);
  };

  // Prevenir scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/40 via-fuchsia-400/40 to-rose-400/40" />

      {/* SVG Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.10]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="plus-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <g transform="rotate(45, 16, 16)">
                <path d="M14 6v8H6v4h8v8h4v-8h8v-4h-8V6h-4z" fill="currentColor" fillOpacity="0.2"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plus-pattern)"></rect>
        </svg>
      </div>

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative h-full overflow-y-auto">
        <motion.div 
          className="min-h-full flex flex-col"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        >
          <AnimatePresence initial={false} mode="wait">
            {SCREENS.map(({ id, Component }, index) => (
              <motion.div
                key={id}
                className={`
                  ${index === currentScreen ? 'opacity-100 visible' : 'opacity-0 invisible absolute inset-0'}
                  min-h-screen w-full flex flex-col
                  ${id === 'login' ? 'justify-start' : 'justify-center'}
                `}
                initial={{ opacity: 0, x: index > currentScreen ? 100 : -100 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }
                }}
                exit={{ 
                  opacity: 0,
                  x: index < currentScreen ? -100 : 100,
                  transition: {
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }
                }}
              >
                <div className="flex-1 flex flex-col">
                  <Component
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onComplete={handleComplete}
                    onLogin={handleLogin}
                    isLast={index === SCREENS.length - 1}
                    isFirst={index === 0}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress Dots */}
      {currentScreen !== SCREENS.length - 1 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
          <div className="flex space-x-2">
            {SCREENS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`w-2 h-2 rounded-full transition-all focus:outline-none ${
                  i === currentScreen
                    ? 'w-4 bg-rose-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={false}
                animate={{
                  width: i === currentScreen ? 16 : 8,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}