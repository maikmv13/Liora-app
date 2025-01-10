import React, { useState } from 'react';
import { Scale, Target, ChevronRight } from 'lucide-react';

interface WeightOnboardingProps {
  onComplete: (initialWeight: number, targetWeight: number) => void;
}

export function WeightOnboarding({ onComplete }: WeightOnboardingProps) {
  const [step, setStep] = useState(1);
  const [initialWeight, setInitialWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && initialWeight) {
      setStep(2);
    } else if (step === 2 && targetWeight) {
      onComplete(parseFloat(initialWeight), parseFloat(targetWeight));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scale size={32} className="text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido/a</h2>
              <p className="text-gray-600 mt-2">
                Para empezar, necesitamos saber tu peso actual
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-rose-900 mb-2">
                Peso actual (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={initialWeight}
                onChange={(e) => setInitialWeight(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Ej: 70.5"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
            >
              <span>Continuar</span>
              <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Establece tu objetivo</h2>
              <p className="text-gray-600 mt-2">
                ¿Cuál es tu peso objetivo?
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-rose-900 mb-2">
                Peso objetivo (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Ej: 65.0"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
            >
              <span>Comenzar</span>
              <ChevronRight size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}