import React, { useState } from 'react';
import { ChefHat, Wand2, X, Flame, Plus, AlertCircle } from 'lucide-react';
import { predefinedIngredients } from './ingredientsData';

interface CookingMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  healthyScore: number;
}

const cookingMethods: CookingMethod[] = [
  { id: 'al_horno', name: 'Al horno', description: 'Cocción seca con calor envolvente', icon: '🔥', healthyScore: 9 },
  { id: 'vapor', name: 'Al vapor', description: 'Cocción suave que preserva nutrientes', icon: '💨', healthyScore: 10 },
  { id: 'plancha', name: 'A la plancha', description: 'Cocción directa con poco aceite', icon: '🍳', healthyScore: 8 },
  { id: 'hervido', name: 'Hervido', description: 'Cocción en agua hirviendo', icon: '💧', healthyScore: 9 },
  { id: 'salteado', name: 'Salteado', description: 'Cocción rápida a fuego alto', icon: '🥘', healthyScore: 7 },
  { id: 'crudo', name: 'Crudo', description: 'Sin cocción, máximos nutrientes', icon: '🥗', healthyScore: 10 },
  { id: 'guisado', name: 'Guisado', description: 'Cocción lenta con líquido', icon: '🥘', healthyScore: 8 },
  { id: 'frito', name: 'Frito', description: 'Cocción en aceite', icon: '🍟', healthyScore: 4 }
];

const categoryStyles = {
  vegetables: {
    gradient: 'from-emerald-400 to-green-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    hover: 'hover:border-emerald-300 hover:bg-emerald-50/50'
  },
  proteins: {
    gradient: 'from-rose-400 to-red-600',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    hover: 'hover:border-rose-300 hover:bg-rose-50/50'
  },
  carbs: {
    gradient: 'from-amber-400 to-yellow-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:border-amber-300 hover:bg-amber-50/50'
  }
};

interface PlateCreatorProps {
  onClose: () => void;
}

interface SelectedIngredient {
  name: string;
  cookingMethod: string;
  category: 'vegetables' | 'proteins' | 'carbs';
}

export function PlateCreator({ onClose }: PlateCreatorProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [currentCategory, setCurrentCategory] = useState<'vegetables' | 'proteins' | 'carbs'>('vegetables');
  const [showCookingMethods, setShowCookingMethods] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const getVegetablesCount = () => 
    selectedIngredients.filter(ing => ing.category === 'vegetables').length;

  const canAddMoreVegetables = () => 
    currentCategory !== 'vegetables' || getVegetablesCount() < 3;

  const handleIngredientSelect = (name: string) => {
    if (!canAddMoreVegetables()) {
      return;
    }
    setSelectedIngredient(name);
    setShowCookingMethods(true);
  };

  const handleCookingMethodSelect = (method: string) => {
    if (selectedIngredient) {
      setSelectedIngredients(prev => [...prev, {
        name: selectedIngredient,
        cookingMethod: method,
        category: currentCategory
      }]);
      setSelectedIngredient(null);
      setShowCookingMethods(false);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const generateRandomPlate = () => {
    const randomIngredients: SelectedIngredient[] = [];
    
    // Seleccionar tres verduras aleatorias
    const vegetables = [...predefinedIngredients.vegetables];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * vegetables.length);
      const randomVegetable = vegetables.splice(randomIndex, 1)[0];
      const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
      randomIngredients.push({
        name: randomVegetable.name,
        cookingMethod: randomMethod.id,
        category: 'vegetables'
      });
    }
    
    // Seleccionar una proteína aleatoria
    const randomProtein = predefinedIngredients.proteins[
      Math.floor(Math.random() * predefinedIngredients.proteins.length)
    ];
    const randomProteinMethod = cookingMethods[
      Math.floor(Math.random() * cookingMethods.length)
    ];
    
    // Seleccionar un carbohidrato aleatorio
    const randomCarb = predefinedIngredients.carbs[
      Math.floor(Math.random() * predefinedIngredients.carbs.length)
    ];
    const randomCarbMethod = cookingMethods[
      Math.floor(Math.random() * cookingMethods.length)
    ];
    
    randomIngredients.push(
      {
        name: randomProtein.name,
        cookingMethod: randomProteinMethod.id,
        category: 'proteins'
      },
      {
        name: randomCarb.name,
        cookingMethod: randomCarbMethod.id,
        category: 'carbs'
      }
    );
    
    setSelectedIngredients(randomIngredients);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Cabecera */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-50 p-3 rounded-xl">
              <ChefHat className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Crea tu plato</h2>
              <p className="text-gray-600">Selecciona ingredientes y su forma de preparación</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={generateRandomPlate}
              className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
              title="Generar plato aleatorio"
            >
              <Wand2 className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Selector de categorías */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setCurrentCategory('vegetables')}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              currentCategory === 'vegetables'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-emerald-200'
            }`}
          >
            <span className="text-2xl mb-2">🥬</span>
            <p className="font-medium">Verduras</p>
            <p className="text-sm text-gray-500">
              {getVegetablesCount()}/3 seleccionadas
            </p>
          </button>
          <button
            onClick={() => setCurrentCategory('proteins')}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              currentCategory === 'proteins'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-gray-200 hover:border-rose-200'
            }`}
          >
            <span className="text-2xl mb-2">🍗</span>
            <p className="font-medium">Proteínas</p>
            <p className="text-sm text-gray-500">25% del plato</p>
          </button>
          <button
            onClick={() => setCurrentCategory('carbs')}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              currentCategory === 'carbs'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-gray-200 hover:border-amber-200'
            }`}
          >
            <span className="text-2xl mb-2">🌾</span>
            <p className="font-medium">Carbohidratos</p>
            <p className="text-sm text-gray-500">25% del plato</p>
          </button>
        </div>

        {/* Aviso de límite de verduras */}
        {currentCategory === 'vegetables' && getVegetablesCount() >= 3 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Has alcanzado el límite de 3 verduras. Elimina alguna para añadir más.
            </p>
          </div>
        )}

        {/* Lista de ingredientes */}
        {!showCookingMethods ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {predefinedIngredients[currentCategory].map((ingredient) => {
              const styles = categoryStyles[currentCategory];
              return (
                <button
                  key={ingredient.name}
                  onClick={() => handleIngredientSelect(ingredient.name)}
                  disabled={!canAddMoreVegetables()}
                  className={`group p-3 rounded-xl relative transition-all duration-300 ${
                    !canAddMoreVegetables() 
                      ? 'opacity-50 cursor-not-allowed'
                      : styles.hover
                  }`}
                  style={{
                    background: `linear-gradient(white, white) padding-box, linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)) border-box`,
                    border: '2px solid transparent'
                  }}
                >
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${styles.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <p className={`font-medium ${styles.text}`}>{ingredient.name}</p>
                  <p className="text-sm text-gray-500">{ingredient.category}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              ¿Cómo quieres preparar {selectedIngredient}?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cookingMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleCookingMethodSelect(method.id)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-rose-200 hover:bg-rose-50/50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">{method.description}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-amber-600">Saludable: {method.healthyScore}/10</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCookingMethods(false)}
              className="mt-4 text-rose-500 hover:text-rose-600 text-sm"
            >
              ← Volver a ingredientes
            </button>
          </div>
        )}

        {/* Plato actual */}
        {selectedIngredients.length > 0 && (
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-100">
            <h3 className="font-medium text-gray-900 mb-3">Tu plato:</h3>
            <div className="space-y-2">
              {selectedIngredients.map((item, index) => {
                const styles = categoryStyles[item.category];
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${styles.bg} border ${styles.border}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">
                        {cookingMethods.find(m => m.id === item.cookingMethod)?.icon}
                      </span>
                      <span className={`font-medium ${styles.text}`}>{item.name}</span>
                      <span className="text-sm text-gray-500">
                        ({cookingMethods.find(m => m.id === item.cookingMethod)?.name})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}