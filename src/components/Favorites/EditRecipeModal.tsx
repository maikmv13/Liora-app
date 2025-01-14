import React, { useState } from 'react';
import { X, Star, Calendar } from 'lucide-react';
import { FavoriteRecipe } from '../../types';

interface EditRecipeModalProps {
  recipe: FavoriteRecipe;
  onClose: () => void;
  onSave: (recipe: FavoriteRecipe) => void;
}

export function EditRecipeModal({ recipe, onClose, onSave }: EditRecipeModalProps) {
  const [notes, setNotes] = useState(recipe.notes || '');
  const [rating, setRating] = useState(recipe.rating || 0);
  const [lastCooked, setLastCooked] = useState(recipe.last_cooked || '');
  const [tags, setTags] = useState<string[]>(recipe.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      ...recipe,
      notes,
      rating,
      last_cooked: lastCooked,
      tags
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{recipe.name}</h2>
              <p className="text-gray-600 mt-1">{recipe.category}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valoración
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`p-2 rounded-lg transition-colors ${
                      value <= rating
                        ? 'text-amber-400'
                        : 'text-gray-300 hover:text-amber-200'
                    }`}
                  >
                    <Star size={24} className="fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Última vez cocinada
              </label>
              <input
                type="date"
                value={lastCooked}
                onChange={(e) => setLastCooked(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Añade notas personales sobre la receta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 h-32 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-rose-50 text-rose-700"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-rose-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Nueva etiqueta..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}