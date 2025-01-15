import { Carrot, Fish, Wheat } from 'lucide-react';
import { FoodGroupType } from './types';

export const foodGroups: FoodGroupType[] = [
  {
    id: 'vegetables',
    name: 'Verduras y Hortalizas',
    percentage: 50,
    color: 'bg-emerald-500',
    icon: <Carrot className="w-6 h-6 text-emerald-500" />,
    examples: [
      'Espinacas', 'Brócoli', 'Zanahorias', 'Tomates', 'Pimientos',
      'Calabacín', 'Berenjena', 'Champiñones', 'Espárragos'
    ],
    tips: [
      'Incluye verduras de diferentes colores',
      'Prioriza verduras de temporada',
      'Alterna entre crudas y cocinadas',
      'Evita sobrecocinarlas para mantener nutrientes'
    ]
  },
  {
    id: 'proteins',
    name: 'Proteínas',
    percentage: 25,
    color: 'bg-rose-500',
    icon: <Fish className="w-6 h-6 text-rose-500" />,
    examples: [
      'Pescado', 'Pollo', 'Huevos', 'Legumbres', 'Tofu',
      'Tempeh', 'Seitán', 'Quinoa', 'Frutos secos'
    ],
    tips: [
      'Alterna entre proteínas animales y vegetales',
      'Prioriza pescados grasos ricos en omega-3',
      'Limita las carnes rojas',
      'Incluye legumbres al menos 3 veces por semana'
    ]
  },
  {
    id: 'carbs',
    name: 'Carbohidratos',
    percentage: 25,
    color: 'bg-amber-500',
    icon: <Wheat className="w-6 h-6 text-amber-500" />,
    examples: [
      'Arroz integral', 'Quinoa', 'Pasta integral', 'Patatas',
      'Pan integral', 'Avena', 'Cebada', 'Mijo', 'Trigo sarraceno'
    ],
    tips: [
      'Prioriza cereales integrales',
      'Controla las porciones',
      'Combina diferentes tipos de granos',
      'Evita carbohidratos refinados'
    ]
  }
];