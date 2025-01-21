import React, { useState } from 'react';
import { X, Target, Info } from 'lucide-react';

interface WaterGoalModalProps {
  currentGoal: number;
  onClose: () => void;
  onUpdateGoal: (newGoal: number) => void;
}

const RECOMMENDED_GOALS = [
  { amount: 2000, label: 'Recomendado', description: 'Para la mayoría de adultos' },
  { amount: 2500, label: 'Activo', description: 'Para personas físicamente activas' },
  { amount: 3000, label: 'Atlético', description: 'Para deportistas' }
];

export function WaterGoalModal({ currentGoal, onClose, onUpdateGoal }: WaterGoalModalProps) {
  const [selectedGoal, setSelectedGoal] = useState(currentGoal);
  const [customGoal, setCustomGoal] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = isCustom ? parseInt(customGoal) : selectedGoal;
    if (newGoal > 0) {
      onUpdateGoal(newGoal);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Objetivo diario</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {RECOMMENDED_GOALS.map(goal => (
              <button
                key={goal.amount}
                type="button"
                onClick={() => {
                  setSelectedGoal(goal.amount);
                  setIsCustom(false);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedGoal === goal.amount && !isCustom
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{goal.label}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <span className="text-lg font-semibold text-blue-500">
                    {goal.amount} ml
                  </span>
                </div>
              </button>
            ))}

            <div className={`p-4 rounded-xl border-2 transition-all ${
              isCustom
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-900">
                  Objetivo personalizado
                </label>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isCustom}
                    onChange={(e) => setIsCustom(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      isCustom ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                        isCustom ? 'right-1' : 'left-1'
                      }`}
                    />
                  </div>
                </div>
              </div>
              {isCustom && (
                <div className="mt-3">
                  <input
                    type="number"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Ingresa tu objetivo en ml"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="500"
                    step="100"
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-600">
                La cantidad de agua que necesitas puede variar según tu peso, nivel de actividad física y clima. Consulta con un profesional de la salud para un objetivo personalizado.
              </p>
            </div>
          </div>

           Continuing the WaterGoalModal.tsx file content from where we left off:

```
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-colors disabled:opacity-50"
              disabled={isCustom && !customGoal}
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}