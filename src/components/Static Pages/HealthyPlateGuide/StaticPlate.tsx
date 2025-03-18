import React, { useState } from 'react';
import { Carrot, Fish, Wheat } from 'lucide-react';

interface LabelPosition {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
}

interface PlateSection {
  title: string;
  percentage: string;
  icon: React.ReactNode;
  gradient: string;
  path: string;
  labelPosition: LabelPosition;
  color: string;
}

export function StaticPlate() {
  const [activeSection, setActiveSection] = useState<'vegetables' | 'proteins' | 'carbs' | null>(null);

  const sections: Record<string, PlateSection> = {
    vegetables: {
      title: 'Verduras',
      percentage: '50%',
      icon: <Carrot className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />,
      gradient: 'url(#vegetablesGradient)',
      path: 'M 50,50 L 50,0 A 50,50 0 0,0 50,100 Z',
      labelPosition: { left: '-5%', top: '50%', transform: 'translateY(-50%)' },
      color: 'emerald'
    },
    proteins: {
      title: 'Proteínas',
      percentage: '25%',
      icon: <Fish className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />,
      gradient: 'url(#proteinsGradient)',
      path: 'M 50,50 L 100,50 A 50,50 0 0,1 50,100 Z',
      labelPosition: { right: '-5%', bottom: '13%' },
      color: 'rose'
    },
    carbs: {
      title: 'Carbohidratos',
      percentage: '25%',
      icon: <Wheat className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />,
      gradient: 'url(#carbsGradient)',
      path: 'M 50,50 L 100,50 A 50,50 0 0,0 50,0 Z',
      labelPosition: { right: '-5%', top: '13%' },
      color: 'amber'
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto pt-8 pb-16">
      {/* Plato principal con efecto de profundidad */}
      <div className="relative aspect-square max-w-[280px] md:max-w-lg mx-auto">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-white shadow-[0_0_60px_rgba(0,0,0,0.1)] border-8 border-white overflow-hidden transform hover:scale-105 transition-transform duration-300">
          {/* Divisiones del plato con gradientes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              {/* Gradientes para cada sección */}
              <linearGradient id="vegetablesGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="rgb(4, 120, 87)" stopOpacity="0.9" />
              </linearGradient>
              
              <linearGradient id="proteinsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(244, 63, 94)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="rgb(225, 29, 72)" stopOpacity="0.9" />
              </linearGradient>
              
              <linearGradient id="carbsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="rgb(217, 119, 6)" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Círculo base blanco */}
            <circle cx="50" cy="50" r="50" fill="white" />

            {/* Secciones interactivas */}
            {Object.entries(sections).map(([key, section]) => (
              <path
                key={key}
                d={section.path}
                fill={section.gradient}
                className={`transition-opacity duration-300 cursor-pointer ${
                  activeSection && activeSection !== key ? 'opacity-50' : 'opacity-90'
                } hover:opacity-100`}
                onMouseEnter={() => setActiveSection(key as 'vegetables' | 'proteins' | 'carbs')}
                onMouseLeave={() => setActiveSection(null)}
              />
            ))}

            {/* Líneas divisorias con efecto suave */}
            <path
              d="M50,0 L50,100 M50,50 L100,50"
              className="stroke-white stroke-[2]"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Etiquetas flotantes */}
        {Object.entries(sections).map(([key, section]) => (
          <div
            key={key}
            className={`absolute transition-all duration-300 ${
              activeSection === key ? 'scale-110 z-10' : 'scale-100'
            }`}
            style={section.labelPosition}
          >
            <div className={`flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-3 md:px-4 py-2 md:py-3 rounded-xl shadow-lg border-2 border-${section.color}-200 hover:scale-105 transition-transform cursor-pointer`}
                 onMouseEnter={() => setActiveSection(key as 'vegetables' | 'proteins' | 'carbs')}
                 onMouseLeave={() => setActiveSection(null)}>
              <div className={`p-1.5 md:p-2 rounded-lg bg-${section.color}-100`}>
                {section.icon}
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-sm md:text-base font-medium text-gray-900">{section.title}</p>
                <p className={`text-xs md:text-sm text-${section.color}-500`}>{section.percentage}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Centro del plato con efecto de cristal */}
        <div className="absolute inset-[30%] rounded-full bg-white/95 backdrop-blur-sm shadow-lg border-4 border-gray-50 flex items-center justify-center transform hover:scale-105 transition-transform">
          <div className="text-center p-1.5 md:p-2">
            <div className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-0.5 md:mb-1 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
              {activeSection ? sections[activeSection].icon : <Carrot className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />}
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-900">
              {activeSection ? sections[activeSection].title : 'Método del Plato'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}