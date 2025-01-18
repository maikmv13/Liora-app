import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { ScreenProps } from './types';
import { ScreenLayout } from '../components/ScreenLayout';

const features = [
  { title: 'Respuestas Instantáneas', description: 'Resuelve tus dudas al momento' },
  { title: 'Consejos Personalizados', description: 'Adaptados a tus necesidades' },
  { title: 'Disponible 24/7', description: 'Siempre listo para ayudarte' }
];

export function AIScreen({ onNext, onPrev }: ScreenProps) {
  return (
    <ScreenLayout
      icon={Brain}
      title="Asistente IA"
      subtitle="Tu guía nutricional"
      description="Cuenta con un asistente inteligente que responde todas tus dudas sobre nutrición"
      color="purple"
      onNext={onNext}
      onPrev={onPrev}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-100"
        >
          <h3 className="font-medium text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
        </motion.div>
      ))}
    </ScreenLayout>
  );
}