import React, { useState } from 'react';
import { X, Plus, ChefHat, Sun, Moon } from 'lucide-react';
import { Recipe } from '../../types';

interface NewRecipeModalProps {
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

export function NewRecipeModal({ onClose, onSave }: NewRecipeModalProps) {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    meal_type: 'comida',
    servings: 2,
    instructions: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipe.name && recipe.category) {
      onSave(recipe as Recipe);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nueva Receta</h2>
              <p className="text-gray-600 mt-1">Añade una nueva receta a tus favoritos</p>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la receta
              </label>
              <input
                type="text"
                value={recipe.name || ''}
                onChange={(e) => setRecipe(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Ej: Pasta carbonara"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={recipe.category || ''}
                onChange={(e) => setRecipe(prev => ({ ...prev, category: e.target.value as "Aves" | "Carnes" | "Ensaladas" | "Fast Food" | "Legumbres" | "Pastas y Arroces" | "Pescados" | "Sopas y Cremas" | "Vegetariano" | "Desayuno" | "Huevos" | "Snack" | "Otros" | undefined }))}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="Aves">Aves</option>
                <option value="Carnes">Carnes</option>
                <option value="Ensaladas">Ensaladas</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Legumbres">Legumbres</option>
                <option value="Pastas y Arroces">Pastas y Arroces</option>
                <option value="Pescados">Pescados</option>
                <option value="Sopas y Cremas">Sopas y Cremas</option>
                <option value="Vegetariano">Vegetariano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de comida
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRecipe(prev => ({ ...prev, meal_type: 'comida' }))}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border transition-colors ${
                    recipe.meal_type === 'comida'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'border-gray-200 text-gray-600 hover:bg-amber-50/50'
                  }`}
                >
                  <Sun size={20} />
                  <span>Comida</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecipe(prev => ({ ...prev, meal_type: 'cena' }))}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border transition-colors ${
                    recipe.meal_type === 'cena'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:bg-indigo-50/50'
                  }`}
                >
                  <Moon size={20} />
                  <span>Cena</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comensales
              </label>
              <input
                type="number"
                min="1"
                value={recipe.servings || ''}
                onChange={(e) => setRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calorías
              </label>
              <input
                type="text"
                value={recipe.calories || ''}
                onChange={(e) => setRecipe(prev => ({ ...prev, calories: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Ej: 450 kcal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de preparación
              </label>
              <input
                type="text"
                value={recipe.prep_time || ''}
                onChange={(e) => setRecipe(prev => ({ ...prev, prep_time: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Ej: 30 min"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-rose-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
            >
              <Plus size={20} />
              <span>Añadir receta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}