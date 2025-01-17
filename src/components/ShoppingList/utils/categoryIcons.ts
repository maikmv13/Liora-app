import { 
  Beef, Fish, Sandwich, Salad, Apple, Cookie, 
  Wheat, Milk, Coffee, Soup, Utensils, Droplet,
  Carrot, ChefHat, Spade, Drumstick, Flame
} from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Carnicería':
      return Beef;
    case 'Pescadería':
      return Fish;
    case 'Charcutería':
      return Sandwich;
    case 'Vegetales y Legumbres':
      return Carrot;
    case 'Frutas':
      return Apple;
    case 'Frutos Secos':
      return Cookie;
    case 'Cereales y Derivados':
      return Wheat;
    case 'Lácteos, Huevos y Derivados':
      return Milk;
    case 'Líquidos y Caldos':
      return Droplet;
    case 'Condimentos y Especias':
      return Spade;
    case 'Salsas y Aderezos':
      return Soup;
    case 'Aceites':
      return Flame; // Changed from Oil to Flame
    case 'Cafés e infusiones':
      return Coffee;
    default:
      return ChefHat;
  }
};