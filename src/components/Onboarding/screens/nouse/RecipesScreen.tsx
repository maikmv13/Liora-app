import React from 'react';
import { motion } from 'framer-motion';
import { Apple } from 'lucide-react';
import { ScreenProps } from '../types';
import { ScreenLayout } from '../components/ScreenLayout';

const features = [
  { title: 'Recetas Variadas', description: 'Para todos los gustos y necesidades' },
  { title: 'Paso a Paso', description: 'Instrucciones claras y detalladas' },
  { title: 'Información Nutricional', description: 'Conoce el valor de cada plato' }
];

export function RecipesScreen({ onNext, onPrev }: ScreenProps) {
  return (
    <ScreenLayout
      icon={Apple}
      title="Recetas Saludables"
      subtitle="Cocina con confianza"
      description="Explora cientos de recetas saludables y aprende a prepararlas paso a paso"
      color="emerald"
      onNext={onNext}
      onPrev={onPrev}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-100"
        >
          <h3 className="font-medium text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
        </motion.div>
      ))}
    </ScreenLayout>
  );
}