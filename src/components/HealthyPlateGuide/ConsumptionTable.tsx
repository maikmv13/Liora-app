import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface FoodFrequency {
  category: string;
  frequency: string;
  examples: string[];
  recommendations: string[];
  limit?: boolean;
}

const frequencies: FoodFrequency[] = [
  {
    category: 'Verduras y hortalizas',
    frequency: 'Diario (2-3 raciones)',
    examples: ['Ensaladas', 'Verduras cocidas', 'Purés de verduras'],
    recommendations: [
      'Variar colores y tipos',
      'Incluir crudas y cocidas',
      'Priorizar productos de temporada'
    ]
  },
  {
    category: 'Frutas',
    frequency: 'Diario (3-4 piezas)',
    examples: ['Manzana', 'Plátano', 'Cítricos', 'Frutos rojos'],
    recommendations: [
      'Consumir enteras mejor que en zumo',
      'Variar tipos y colores',
      'Preferir frutas de temporada'
    ]
  },
  {
    category: 'Cereales integrales',
    frequency: 'Diario (4-6 raciones)',
    examples: ['Pan integral', 'Arroz integral', 'Pasta integral', 'Quinoa'],
    recommendations: [
      'Priorizar versiones integrales',
      'Controlar las porciones',
      'Combinar con legumbres'
    ]
  },
  {
    category: 'Proteínas magras',
    frequency: '2-3 veces por semana cada tipo',
    examples: ['Pescado', 'Pollo', 'Huevos', 'Legumbres'],
    recommendations: [
      'Alternar fuentes animales y vegetales',
      'Priorizar pescado sobre carne',
      'Incluir legumbres frecuentemente'
    ]
  },
  {
    category: 'Lácteos y alternativas',
    frequency: 'Diario (2-3 raciones)',
    examples: ['Yogur natural', 'Queso fresco', 'Bebidas vegetales fortificadas'],
    recommendations: [
      'Preferir versiones sin azúcar añadido',
      'Moderar el consumo de quesos grasos',
      'Considerar alternativas vegetales'
    ]
  },
  {
    category: 'Grasas saludables',
    frequency: 'Diario (con moderación)',
    examples: ['Aceite de oliva', 'Aguacate', 'Frutos secos'],
    recommendations: [
      'Usar aceite de oliva como grasa principal',
      'Incluir frutos secos sin sal',
      'Controlar las porciones'
    ]
  },
  {
    category: 'Alimentos procesados',
    frequency: 'Ocasional',
    examples: ['Bollería', 'Refrescos', 'Snacks', 'Embutidos'],
    recommendations: [
      'Limitar su consumo',
      'Reservar para ocasiones especiales',
      'Buscar alternativas más saludables'
    ],
    limit: true
  }
];

export function ConsumptionTable() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden">
      <div className="p-4 border-b border-rose-100 bg-gradient-to-r from-orange-50 to-rose-50">
        <h3 className="font-semibold text-gray-900">Frecuencia de consumo recomendada</h3>
        <p className="text-sm text-gray-600 mt-1">
          Guía para una alimentación equilibrada y saludable
        </p>
      </div>
      
      <div className="divide-y divide-rose-100">
        {frequencies.map((item) => (
          <div 
            key={item.category}
            className={`p-4 transition-colors ${
              item.limit ? 'bg-red-50/50' : 'hover:bg-rose-50/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{item.category}</h4>
                <p className={`text-sm ${item.limit ? 'text-red-600' : 'text-rose-600'} mt-1`}>
                  {item.frequency}
                </p>
              </div>
              {item.limit ? (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              ) : (
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Ejemplos:</p>
                <div className="flex flex-wrap gap-2">
                  {item.examples.map((example) => (
                    <span
                      key={example}
                      className={`px-2 py-1 rounded-lg text-xs ${
                        item.limit
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Recomendaciones:</p>
                <ul className="space-y-1">
                  {item.recommendations.map((rec) => (
                    <li key={rec} className="flex items-start space-x-2">
                      <Check className={`w-4 h-4 mt-0.5 ${
                        item.limit ? 'text-red-500' : 'text-emerald-500'
                      }`} />
                      <span className="text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}