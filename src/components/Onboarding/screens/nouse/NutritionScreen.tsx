import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { ScreenProps } from './types';
import { ScreenLayout } from '../components/ScreenLayout';

const features = [
  { title: 'Análisis Nutricional', description: 'Conoce el valor de tus alimentos' },
  { title: 'Objetivos Personalizados', description: 'Define y alcanza tus metas' },
  { title: 'Seguimiento Diario', description: 'Monitorea tu progreso' }
];

export function NutritionScreen({ onNext, onPrev }: ScreenProps) {
  return (
    <ScreenLayout
      icon={Heart}
      title="Nutrición Personalizada"
      subtitle="Consejos adaptados a ti"
      description="Recibe recomendaciones nutricionales basadas en tus objetivos y preferencias"
      color="rose"
      onNext={onNext}
      onPrev={onPrev}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-rose-100"
        >
          <h3 className="font-medium text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
        </motion.div>
      ))}
    </ScreenLayout>
  );
}