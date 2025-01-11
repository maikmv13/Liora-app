import React, { useState } from 'react';
import { X, Plus, ChefHat, Clock, Users, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AddRecipeFormProps {
  onClose: () => void;
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Instruction {
  step: number;
  text: string;
}

export function AddRecipeForm({ onClose }: AddRecipeFormProps) {
  const [recipe, setRecipe] = useState({
    name: '',
    side_dish: '',
    meal_type: 'comida' as const,
    category: 'Carnes' as const,
    servings: 2,
    calories: '',
    prep_time: '',
    ingredients: [] as Ingredient[],
    instructions: [] as Instruction[],
    image_url: ''
  });

  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    quantity: 0,
    unit: 'gramo'
  });

  const [currentInstruction, setCurrentInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => {
    if (currentIngredient.name && currentIngredient.quantity > 0) {
      setRecipe(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { ...currentIngredient }]
      }));
      setCurrentIngredient({ name: '', quantity: 0, unit: 'gramo' });
    }
  };

  const handleAddInstruction = () => {
    if (currentInstruction.trim()) {
      setRecipe(prev => ({
        ...prev,
        instructions: [
          ...prev.instructions,
          { step: prev.instructions.length + 1, text: currentInstruction.trim() }
        ]
      }));
      setCurrentInstruction('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insertar la receta
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          name: recipe.name,
          side_dish: recipe.side_dish || null,
          meal_type: recipe.meal_type,
          category: recipe.category,
          servings: recipe.servings,
          calories: recipe.calories || null,
          prep_time: recipe.prep_time || null,
          instructions: recipe.instructions.reduce((acc, curr) => {
            acc[`Paso ${curr.step}`] = curr.text;
            return acc;
          }, {} as Record<string, string>),
          image_url: recipe.image_url || null
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // 2. Insertar ingredientes
      for (const ingredient of recipe.ingredients) {
        // Primero intentar insertar el ingrediente
        const { data: ingredientData, error: ingredientError } = await supabase
          .from('ingredients')
          .insert({ name: ingredient.name })
          .select()
          .single();

        if (ingredientError && !ingredientError.message.includes('duplicate key')) {
          throw ingredientError;
        }

        // Luego crear la relación receta-ingrediente
        const { error: relationError } = await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: recipeData.id,
            ingredient_id: ingredientData?.id,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          });

        if (relationError) throw relationError;
      }

      onClose();
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error al crear la receta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-3 rounded-xl">
                <ChefHat className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nueva Receta</h2>
                <p className="text-gray-600">Añade una nueva receta a la colección</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la receta
                </label>
                <input
                  type="text"
                  value={recipe.name}
                  onChange={(e) => setRecipe(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acompañamiento
                </label>
                <input
                  type="text"
                  value={recipe.side_dish}
                  onChange={(e) => setRecipe(prev => ({ ...prev, side_dish: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de comida
                </label>
                <select
                  value={recipe.meal_type}
                  onChange={(e) => setRecipe(prev => ({ ...prev, meal_type: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="comida">Comida</option>
                  <option value="cena">Cena</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={recipe.category}
                  onChange={(e) => setRecipe(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Carnes">Carnes</option>
                  <option value="Pescados">Pescados</option>
                  <option value="Vegetariano">Vegetariano</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Sopas">Sopas</option>
                  <option value="Ensaladas">Ensaladas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comensales
                </label>
                <input
                  type="number"
                  value={recipe.servings}
                  onChange={(e) => setRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calorías
                </label>
                <input
                  type="text"
                  value={recipe.calories}
                  onChange={(e) => setRecipe(prev => ({ ...prev, calories: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  placeholder="Ej: 450 kcal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de preparación
                </label>
                <input
                  type="text"
                  value={recipe.prep_time}
                  onChange={(e) => setRecipe(prev => ({ ...prev, prep_time: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  placeholder="Ej: 30 min"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la imagen
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={recipe.image_url}
                    onChange={(e) => setRecipe(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <button
                    type="button"
                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                    onClick={() => {
                      // Aquí podrías abrir un selector de imágenes
                    }}
                  >
                    <Image className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Ingredientes</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentIngredient.name}
                    onChange={(e) => setCurrentIngredient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del ingrediente"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  />
                  <input
                    type="number"
                    value={currentIngredient.quantity || ''}
                    onChange={(e) => setCurrentIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
                    placeholder="Cantidad"
                    className="w-24 px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  />
                  <select
                    value={currentIngredient.unit}
                    onChange={(e) => setCurrentIngredient(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-32 px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="gramo">gramos</option>
                    <option value="unidad">unidades</option>
                    <option value="cucharada">cucharadas</option>
                    <option value="pizca">pizcas</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {recipe.ingredients.map((ing, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-rose-50 rounded-xl"
                    >
                      <span className="text-gray-700">{ing.name}</span>
                      <span className="text-gray-600">
                        {ing.quantity} {ing.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setRecipe(prev => ({
                            ...prev,
                            ingredients: prev.ingredients.filter((_, i) => i !== index)
                          }));
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Instrucciones</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentInstruction}
                    onChange={(e) => setCurrentInstruction(e.target.value)}
                    placeholder="Añade un paso de la receta..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {recipe.instructions.map((inst, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-rose-50 rounded-xl"
                    >
                      <span className="bg-white w-6 h-6 rounded-lg flex items-center justify-center text-sm font-medium text-rose-500 flex-shrink-0">
                        {inst.step}
                      </span>
                      <p className="text-gray-700 flex-1">{inst.text}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setRecipe(prev => ({
                            ...prev,
                            instructions: prev.instructions.filter((_, i) => i !== index)
                          }));
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-rose-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <ChefHat className="w-5 h-5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Crear Receta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}