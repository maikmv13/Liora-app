import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { ScreenProps } from './types';
import { ScreenLayout } from '../components/ScreenLayout';

const features = [
  { title: 'Menú Semanal', description: 'Planifica tus comidas con anticipación' },
  { title: 'Lista de Compras', description: 'Genera listas automáticamente' },
  { title: 'Recordatorios', description: 'No olvides ninguna comida' }
];

export function PlanningScreen({ onNext, onPrev }: ScreenProps) {
  return (
    <ScreenLayout
      icon={Calendar}
      title="Planificación Inteligente"
      subtitle="Organiza tu alimentación"
      description="Planifica tus comidas semanales y genera listas de compra automáticamente"
      color="orange"
      onNext={onNext}
      onPrev={onPrev}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-orange-100"
        >
          <h3 className="font-medium text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
        </motion.div>
      ))}
    </ScreenLayout>
  );
}