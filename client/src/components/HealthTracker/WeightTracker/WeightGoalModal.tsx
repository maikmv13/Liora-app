import React, { useState, useEffect } from 'react';
import { X, Target, ChevronRight, ChevronLeft, TrendingDown, TrendingUp, Minus, Scale, Calendar, Activity, Gift, AlertCircle } from 'lucide-react';

interface WeightGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeight: number;
  targetWeight: number;
  onUpdateTarget: (weight: number) => void;
}

type GoalType = 'lose' | 'gain' | 'maintain';

// Constantes para recomendaciones saludables
const HEALTHY_WEEKLY_LOSS = 0.5; // kg por semana (máximo recomendado: 1kg)
const HEALTHY_WEEKLY_GAIN = 0.25; // kg por semana (máximo recomendado: 0.5kg)
const MIN_WEEKS = 4;
const MAX_WEEKS = 52;

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
  const [duration, setDuration] = useState(12); // Duración en semanas
  const [weeklyChange, setWeeklyChange] = useState(0);

  // Calcular la duración recomendada basada en el cambio total y las tasas saludables
  useEffect(() => {
    const targetNum = parseFloat(newTarget);
    if (!isNaN(targetNum)) {
      const totalChange = Math.abs(targetNum - currentWeight);
      const isGaining = targetNum > currentWeight;
      const recommendedWeeklyChange = isGaining ? HEALTHY_WEEKLY_GAIN : HEALTHY_WEEKLY_LOSS;
      const recommendedDuration = Math.ceil(totalChange / recommendedWeeklyChange);
      
      // Ajustar a los límites min/max
      const adjustedDuration = Math.min(Math.max(recommendedDuration, MIN_WEEKS), MAX_WEEKS);
      setDuration(adjustedDuration);
      
      // Calcular el cambio semanal basado en la duración
      const calculatedWeeklyChange = totalChange / adjustedDuration;
      setWeeklyChange(calculatedWeeklyChange);
    }
  }, [newTarget, currentWeight]);

  const handleDurationChange = (newDuration: number) => {
    const targetNum = parseFloat(newTarget);
    if (!isNaN(targetNum)) {
      const totalChange = Math.abs(targetNum - currentWeight);
      const newWeeklyChange = totalChange / newDuration;
      setDuration(newDuration);
      setWeeklyChange(newWeeklyChange);
    }
  };

  const isWeeklyChangeHealthy = () => {
    const isGaining = parseFloat(newTarget) > currentWeight;
    return isGaining 
      ? weeklyChange <= HEALTHY_WEEKLY_GAIN * 2
      : weeklyChange <= HEALTHY_WEEKLY_LOSS * 2;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3].map((stepNumber) => (
        <div
          key={stepNumber}
          className={`flex items-center ${stepNumber !== 3 && 'flex-1'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === stepNumber
              ? 'bg-gradient-to-r from-rose-400 to-orange-500 text-white shadow-lg'
              : step > stepNumber
              ? 'bg-emerald-100 text-emerald-500'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {step > stepNumber ? '✓' : stepNumber}
          </div>
          {stepNumber !== 3 && (
            <div className={`h-1 flex-1 mx-2 rounded ${
              step > stepNumber
                ? 'bg-emerald-100'
                : 'bg-gray-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderGoalTypeSelection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-100">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Scale className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Peso actual: {currentWeight} kg</h3>
            <p className="text-sm text-gray-600">
              Selecciona tu objetivo para personalizar tu experiencia
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => {
            setGoalType('lose');
            setNewTarget((currentWeight - 5).toString());
            setStep(2);
          }}
          className={`group relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 ${
            goalType === 'lose'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              goalType === 'lose'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-100 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'
            } transition-colors`}>
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Perder peso</h4>
              <p className="text-sm text-gray-500 mt-1">
                Reduce tu peso de forma saludable y sostenible
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 ${
              goalType === 'lose' ? 'text-emerald-500' : 'text-gray-300'
            }`} />
          </div>
        </button>

        <button
          onClick={() => {
            setGoalType('maintain');
            setNewTarget(currentWeight.toString());
            setStep(2);
          }}
          className={`group relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 ${
            goalType === 'maintain'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              goalType === 'maintain'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
            } transition-colors`}>
              <Minus className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Mantener peso</h4>
              <p className="text-sm text-gray-500 mt-1">
                Mantén tu peso actual y hábitos saludables
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 ${
              goalType === 'maintain' ? 'text-blue-500' : 'text-gray-300'
            }`} />
          </div>
        </button>

        <button
          onClick={() => {
            setGoalType('gain');
            setNewTarget((currentWeight + 5).toString());
            setStep(2);
          }}
          className={`group relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 ${
            goalType === 'gain'
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              goalType === 'gain'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-100 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'
            } transition-colors`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Ganar peso</h4>
              <p className="text-sm text-gray-500 mt-1">
                Aumenta tu peso de forma saludable y controlada
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 ${
              goalType === 'gain' ? 'text-amber-500' : 'text-gray-300'
            }`} />
          </div>
        </button>
      </div>
    </div>
  );

  const renderTargetSelection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 mb-3">Define tu objetivo de peso</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso objetivo (kg)
          </label>
          <input
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            step="0.1"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderPlanConfirmation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Gift className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Plan personalizado</h3>
            <p className="text-sm text-gray-600">
              Hemos creado un plan adaptado a tus objetivos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-rose-500" />
                <span className="font-medium text-gray-900">Objetivo principal</span>
              </div>
              <span className="font-medium text-rose-500">{newTarget} kg</span>
            </div>
            <p className="text-sm text-gray-600">
              {goalType === 'maintain'
                ? `Mantener peso en ${currentWeight} kg (±2 kg)`
                : `${goalType === 'lose' ? 'Perder' : 'Ganar'} ${Math.abs(currentWeight - parseFloat(newTarget)).toFixed(1)} kg`
              }
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span className="font-medium text-gray-900">Plan semanal</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Cambio semanal objetivo: {weeklyChange.toFixed(2)} kg</p>
              <p>• Duración estimada: {duration} semanas</p>
              <p>• Registros semanales recomendados: 2-3</p>
              <p>• Revisión de progreso: Cada 4 semanas</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-rose-500" />
              <span className="font-medium text-gray-900">Recomendaciones</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Mantén una dieta equilibrada</p>
              <p>• Realiza actividad física regular</p>
              <p>• Registra tu peso consistentemente</p>
              <p>• Ajusta tu objetivo si es necesario</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onUpdateTarget(parseFloat(newTarget));
        onClose();
      }} className="space-y-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-orange-500 text-white rounded-xl hover:from-rose-500 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Establecer objetivo
          </button>
        </div>
      </form>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Establecer objetivo</h2>
              <p className="text-sm text-gray-600 mt-1">Define tu meta de peso</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {renderStepIndicator()}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 1 && renderGoalTypeSelection()}
          {step === 2 && renderTargetSelection()}
          {step === 3 && renderPlanConfirmation()}
        </div>
      </div>
    </div>
  );
}