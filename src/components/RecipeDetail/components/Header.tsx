import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { Recipe } from '../../../types';

interface HeaderProps {
  recipe: Recipe;
}

export function Header({ recipe }: HeaderProps) {
  const location = useLocation();
  
  // Función para obtener el título de la sección actual
  const getSectionTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/recipe/')) return 'Recetas';
    if (path.startsWith('/menu')) return 'Menú';
    if (path.startsWith('/compra')) return 'Lista de Compra';
    if (path.startsWith('/salud')) {
      const hash = location.hash.slice(1);
      switch (hash) {
        case 'health': return 'Salud';
        case 'weight': return 'Peso';
        case 'exercise': return 'Ejercicio';
        case 'habits': return 'Hábitos';
        default: return 'Objetivos';
      }
    }
    return 'Recetas';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Capa de fondo con efecto glassmorphism */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl shadow-lg" />
      
      {/* Efecto de borde brillante */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      
      {/* Contenido */}
      <div className="container mx-auto px-4 relative">
        <div className="h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Título de la sección */}
            <span className="text-sm font-medium text-rose-500/80">
              {getSectionTitle()}
            </span>
            
            {/* Separador */}
            <span className="text-gray-300">/</span>
            
            {/* Nombre de la receta */}
            <h2 className="font-medium text-gray-900 line-clamp-1 max-w-[200px] sm:max-w-md">
              {recipe.name}
            </h2>
          </motion.div>

          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-100/0 via-rose-100/10 to-rose-100/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>
      
      {/* Sombra inferior con degradado */}
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}