import React, { useState } from 'react';
import { X, Target, ChevronRight, ChevronLeft, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface WeightGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeight: number;
  targetWeight: number;
  onUpdateTarget: (weight: number) => void;
}

type GoalType = 'lose' | 'gain' | 'maintain';

export function WeightGoalModal({
  isOpen,
  onClose,
  currentWeight,
  targetWeight,
  onUpdateTarget
}: WeightGoalModalProps) {
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<GoalType>('maintain');
  const [newTarget, setNewTarget] = useState(targetWeight.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTarget(parseFloat(newTarget));
    onClose();
  };

  const calculateRecommendedChange = () => {
    const difference = Math.abs(currentWeight - parseFloat(newTarget));
    const weeklyChange = difference / 12; // 12 semanas como objetivo inicial
    return weeklyChange.toFixed(1);
  };

  const renderGoalTypeSelection = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-100">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-rose-100 p-2 rounded-lg">
            <Target size={18} className="text-rose-500" />
          </div>
          <h3 className="font-medium text-rose-900">Peso actual: {currentWeight} kg</h3>
        </div>
        <p className="text-sm text-rose-700">
          Selecciona tu objetivo para personalizar tu experiencia y recibir recomendaciones adaptadas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => {
            setGoalType('lose');
            setNewTarget((currentWeight - 5).toString());
            setStep(2);
          }}
          className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${
            goalType === 'lose'
              ? 'bg-green-50 border-green-200'
              : 'border-gray-200 hover:bg-green-50/50'
          }`}
        >
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingDown size={18} className="text-green-500" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">Perder peso</h4>
            <p className="text-sm text-gray-500">Reduce tu peso de forma saludable</p>
          </div>
        </button>

        <button
          onClick={() => {
            setGoalType('maintain');
            setNewTarget(currentWeight.toString());
            setStep(2);
          }}
          className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${
            goalType === 'maintain'
              ? 'bg-blue-50 border-blue-200'
              : 'border-gray-200 hover:bg-blue-50/50'
          }`}
        >
          <div className="bg-blue-100 p-2 rounded-lg">
            <Minus size={18} className="text-blue-500" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">Mantener peso</h4>
            <p className="text-sm text-gray-500">Mantén tu peso actual</p>
          </div>
        </button>

        <button
          onClick={() => {
            setGoalType('gain');
            setNewTarget((currentWeight + 5).toString());
            setStep(2);
          }}
          className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${
            goalType === 'gain'
              ? 'bg-orange-50 border-orange-200'
              : 'border-gray-200 hover:bg-orange-50/50'
          }`}
        >
          <div className="bg-orange-100 p-2 rounded-lg">
            <TrendingUp size={18} className="text-orange-500" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">Ganar peso</h4>
            <p className="text-sm text-gray-500">Aumenta tu peso de forma saludable</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderTargetSelection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-100">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-rose-100 p-2 rounded-lg">
            <Target size={18} className="text-rose-500" />
          </div>
          <h3 className="font-medium text-rose-900">
            {goalType === 'maintain' ? 'Mantener peso actual' : 'Establecer peso objetivo'}
          </h3>
        </div>
        <p className="text-sm text-rose-700">
          {goalType === 'lose' && 'Se recomienda una pérdida gradual de 0.5-1 kg por semana.'}
          {goalType === 'gain' && 'Se recomienda un aumento gradual de 0.25-0.5 kg por semana.'}
          {goalType === 'maintain' && 'Mantén un registro regular para controlar las fluctuaciones.'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {goalType === 'maintain' ? 'Rango objetivo (±2 kg)' : 'Peso objetivo'}
        </label>
        <input
          type="number"
          step="0.1"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          placeholder="Peso objetivo en kg"
          disabled={goalType === 'maintain'}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Atrás</span>
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
        >
          <span>Continuar</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderPlanConfirmation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-100">
        <h3 className="font-medium text-rose-900 mb-3">Plan personalizado</h3>
        <div className="space-y-2 text-sm text-rose-700">
          {goalType === 'maintain' ? (
            <>
              <p>• Mantener peso en {currentWeight} kg (±2 kg)</p>
              <p>• Registra tu peso 2-3 veces por semana</p>
              <p>• Mantén una dieta equilibrada</p>
              <p>• Realiza actividad física regular</p>
            </>
          ) : (
            <>
              <p>• Objetivo semanal: {calculateRecommendedChange()} kg por semana</p>
              <p>• Duración estimada: 12 semanas</p>
              <p>• Registra tu peso 2-3 veces por semana</p>
              <p>• Mantén una dieta equilibrada y haz ejercicio regular</p>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
          >
            <ChevronLeft size={18} />
            <span>Atrás</span>
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white py-2.5 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
          >
            Establecer objetivo
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Establecer objetivo</h2>
            <p className="text-sm text-gray-600 mt-1">Define tu meta de peso</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {step === 1 && renderGoalTypeSelection()}
        {step === 2 && renderTargetSelection()}
        {step === 3 && renderPlanConfirmation()}
      </div>
    </div>
  );
}