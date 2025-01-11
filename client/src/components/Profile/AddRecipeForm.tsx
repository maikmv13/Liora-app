import React, { useState } from 'react';
import { Plus, Minus, ChefHat, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Ingredient {
  name: string;
  quantity: number;
  unit: 'sobre' | 'gramo' | 'unidad' | 'pizca' | 'cucharada' | 'cucharadita';
}

interface Instruction {
  step: number;
  text: string;
}

export function AddRecipeForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipe, setRecipe] = useState({
    name: '',
    side_dish: '',
    meal_type: 'comida' as const,
    category: 'Carnes' as const,
    servings: 2,
    calories: '',
    prep_time: '',
    ingredients: [] as Ingredient[],
    instructions: [] as Instruction[]
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (recipeId: string): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${recipeId}.${fileExt}`;
    const filePath = `recipes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
          }, {} as Record<string, string>)
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // 2. Subir imagen si existe
      if (imageFile) {
        const imageUrl = await uploadImage(recipeData.id);
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from('recipes')
            .update({ image_url: imageUrl })
            .eq('id', recipeData.id);

          if (updateError) throw updateError;
        }
      }

      // 3. Procesar ingredientes
      for (const ingredient of recipe.ingredients) {
        // Verificar si el ingrediente existe
        let { data: existingIngredient } = await supabase
          .from('ingredients')
          .select('id')
          .eq('name', ingredient.name)
          .single();

        // Si no existe, crearlo
        if (!existingIngredient) {
          const { data: newIngredient, error: ingredientError } = await supabase
            .from('ingredients')
            .insert({ name: ingredient.name })
            .select()
            .single();

          if (ingredientError) throw ingredientError;
          existingIngredient = newIngredient;
        }

        // Crear relación receta-ingrediente
        const { error: relationError } = await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: recipeData.id,
            ingredient_id: existingIngredient.id,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          });

        if (relationError) throw relationError;
      }

      onClose();
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err instanceof Error ? err.message : 'Error al añadir la receta');
    } finally {
      setLoading(false);
    }
  };

  // ... resto del código del formulario ...

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* ... código existente ... */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de imagen */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="recipe-image"
            />
            <label
              htmlFor="recipe-image"
              className={`block w-full aspect-video rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                imagePreview ? 'border-rose-200' : 'border-gray-300 hover:border-rose-300'
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Haz clic para subir una imagen
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* ... resto del formulario ... */}
        </form>
      </div>
    </div>
  );
}