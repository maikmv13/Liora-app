import React, { useState, useRef, useEffect } from 'react';
import { HealthDashboard } from './HealthDashboard';
import { WeightTracker } from './WeightTracker';
import { ExerciseTracker } from './ExerciseTracker';
import { HabitTracker } from './HabitTracker';
import { TabNavigation } from './TabNavigation';
import { Heart, Scale, Dumbbell, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HEALTH_TABS = [
  { id: 'health', label: 'Salud', icon: Heart, gradient: 'from-violet-400 to-fuchsia-500' },
  { id: 'weight', label: 'Peso', icon: Scale, gradient: 'from-rose-400 to-orange-500' },
  { id: 'exercise', label: 'Ejercicio', icon: Dumbbell, gradient: 'from-emerald-400 to-teal-500' },
  { id: 'habits', label: 'Hábitos', icon: CheckSquare, gradient: 'from-amber-400 to-orange-500' }
] as const;

type HealthTabId = typeof HEALTH_TABS[number]['id'];

export function HealthTracker() {
  const [activeTab, setActiveTab] = useState<HealthTabId>('health');
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);

  // Manejar cambio de pestaña con animación
  const handleTabChange = (tabId: HealthTabId) => {
    const currentIndex = HEALTH_TABS.findIndex(tab => tab.id === activeTab);
    const newIndex = HEALTH_TABS.findIndex(tab => tab.id === tabId);
    const direction = newIndex > currentIndex ? 1 : -1;
    
    setActiveTab(tabId);
    setDragDistance(0);
  };

  // Eventos táctiles y de ratón
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

    const threshold = window.innerWidth * 0.2; // 20% del ancho de la pantalla
    const currentIndex = HEALTH_TABS.findIndex(tab => tab.id === activeTab);

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && currentIndex > 0) {
        // Deslizar a la derecha -> pestaña anterior
        handleTabChange(HEALTH_TABS[currentIndex - 1].id);
      } else if (dragDistance < 0 && currentIndex < HEALTH_TABS.length - 1) {
        // Deslizar a la izquierda -> pestaña siguiente
        handleTabChange(HEALTH_TABS[currentIndex + 1].id);
      }
    }
    setDragDistance(0);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navegación */}
        <TabNavigation
          tabs={HEALTH_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Contenedor con detección de gestos */}
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
              key={activeTab}
              initial={{ opacity: 0, x: dragDistance }}
              animate={{ opacity: 1, x: dragDistance }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                transform: `translateX(${dragDistance}px)`,
                touchAction: 'pan-y'
              }}
            >
              {activeTab === 'health' && <HealthDashboard />}
              {activeTab === 'weight' && <WeightTracker />}
              {activeTab === 'exercise' && <ExerciseTracker />}
              {activeTab === 'habits' && <HabitTracker />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default HealthTracker;