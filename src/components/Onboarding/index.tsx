import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { FeaturesScreen } from './screens/FeaturesScreen';
import { OnboardingLogin } from './screens/OnboardingLogin';

interface OnboardingProps {
  onComplete: () => void;
  onLogin: () => void;
}

export function Onboarding({ onComplete, onLogin }: OnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [dragDirection, setDragDirection] = useState<number>(0);

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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const { offset } = info;

    if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0 && currentScreen > 0) {
        handlePrev();
      } else if (offset.x < 0 && currentScreen < SCREENS.length - 1) {
        handleNext();
      }
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentScreen(index);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-fuchsia-400/20 to-rose-400/20" />

      {/* SVG Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeOpacity="0.2"></path>
            </pattern>
            <pattern id="dots-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="currentColor" fillOpacity="0.2"/>
              <circle cx="36" cy="36" r="1" fill="currentColor" fillOpacity="0.2"/>
            </pattern>
            <pattern id="squares-pattern" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M8 8h8v8H8zM40 40h8v8h-8z" fill="currentColor" fillOpacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)"></rect>
          <rect width="100%" height="100%" fill="url(#dots-pattern)"></rect>
          <rect width="100%" height="100%" fill="url(#squares-pattern)"></rect>
        </svg>
      </div>

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative h-full">
        <motion.div 
          className="h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: dragDirection }}
        >
          <AnimatePresence mode="wait">
            {SCREENS.map(({ id, Component }, index) => (
              <motion.div
                key={id}
                className={`h-full ${
                  index === currentScreen ? 'opacity-100 visible' : 'opacity-0 invisible absolute inset-0'
                }`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Component
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onComplete={onComplete}
                  onLogin={onLogin}
                  isLast={index === SCREENS.length - 1}
                  isFirst={index === 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-2 z-10">
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
    </div>
  );
}