import React, { useState } from 'react';
import { Scale, Target, ChevronRight, Info } from 'lucide-react';

interface WeightOnboardingProps {
  onComplete: (initialWeight: number, targetWeight: number) => void;
}

interface SubGoal {
  weight: number;
  description: string;
}

export function WeightOnboarding({ onComplete }: WeightOnboardingProps) {
  const [step, setStep] = useState(1);
  const [initialWeight, setInitialWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [subGoals, setSubGoals] = useState<SubGoal[]>([]);

  const calculateSubGoals = (start: number, end: number) => {
    const isGaining = end > start;
    const totalChange = Math.abs(end - start);
    const numberOfGoals = 3; // Dividimos en 3 sub-objetivos
    const changePerGoal = totalChange / numberOfGoals;

    return Array.from({ length: numberOfGoals }, (_, index) => {
      const progress = (index + 1) / numberOfGoals;
      const weight = isGaining
        ? start + (changePerGoal * (index + 1))
        : start - (changePerGoal * (index + 1));

      return {
        weight: Math.round(weight * 10) / 10,
        description: getGoalDescription(progress, isGaining)
      };
    });
  };

  const getGoalDescription = (progress: number, isGaining: boolean) => {
    const action = isGaining ? 'ganancia' : 'pérdida';
    if (progress <= 0.33) {
      return `Primera meta de ${action}`;
    } else if (progress <= 0.66) {
      return `Punto intermedio de ${action}`;
    } else {
      return 'Objetivo final';
    }
  };

  const handleNextStep = () => {
    if (step === 1 && initialWeight) {
      setStep(2);
    } else if (step === 2 && targetWeight) {
      const goals = calculateSubGoals(
        parseFloat(initialWeight),
        parseFloat(targetWeight)
      );
      setSubGoals(goals);
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialWeight && targetWeight) {
      localStorage.setItem('weightSubGoals', JSON.stringify(subGoals));
      onComplete(parseFloat(initialWeight), parseFloat(targetWeight));
    }
  };

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Scale size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Hola! 👋</h2>
        <p className="text-gray-600 mt-2">
          Vamos a empezar tu viaje hacia un estilo de vida más saludable 🌟
        </p>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl">
        <label className="block text-sm font-medium text-rose-900 mb-2">
          ¿Cuál es tu peso actual? ⚖️
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
        <p className="text-xs text-rose-600 mt-2">
          💡 Tip: Pésate por la mañana antes de desayunar para mayor precisión
        </p>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        disabled={!initialWeight}
        className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>¡Empecemos! 🚀</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Genial! 🎯</h2>
        <p className="text-gray-600 mt-2">
          Ahora vamos a establecer tu objetivo para personalizar tu experiencia
        </p>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl">
        <label className="block text-sm font-medium text-rose-900 mb-2">
          ¿Cuál es tu peso objetivo? 🎯
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
        <div className="mt-3 space-y-2">
          <p className="text-xs text-rose-600 flex items-center">
            <span className="mr-2">💪</span>
            Establece metas realistas y alcanzables
          </p>
          <p className="text-xs text-rose-600 flex items-center">
            <span className="mr-2">🎯</span>
            Cambios graduales son más sostenibles
          </p>
          <p className="text-xs text-rose-600 flex items-center">
            <span className="mr-2">📈</span>
            Podrás ajustar tu objetivo más adelante
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!targetWeight}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continuar</span>
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-sm"
        >
          ← Volver atrás
        </button>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Info size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Plan personalizado! 📋</h2>
        <p className="text-gray-600 mt-2">
          Hemos dividido tu objetivo en metas más pequeñas y alcanzables
        </p>
      </div>

      <div className="space-y-4">
        {subGoals.map((goal, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{goal.description}</h4>
                <p className="text-sm text-gray-600">Objetivo: {goal.weight} kg</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-rose-600">
                Meta {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
        >
          <span>¡Comenzar mi viaje! 🚀</span>
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="w-full py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-sm"
        >
          ← Volver atrás
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </div>
    </div>
  );
}