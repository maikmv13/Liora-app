import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { StepIndicator } from './components/StepIndicator';
import { CategorySelection } from './components/CategorySelection';
import { HabitSelection } from './components/HabitSelection';
import { PRESET_HABITS } from './constants';
import type { HabitCreatorProps } from './types';

export function HabitCreator({ onCreateHabit, onClose }: HabitCreatorProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof PRESET_HABITS | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<{
    title: string;
    icon: string;
  } | null>(null);
  const [customHabit, setCustomHabit] = useState({
    title: '',
    icon: '',
    category: 'physical' as const
  });
  const [isCustom, setIsCustom] = useState(false);

  // Configuración de frecuencia
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState('morning');
  const [customTime, setCustomTime] = useState('08:00');
  const [reminder, setReminder] = useState(true);

  const handleSelectPreset = (preset: typeof selectedPreset) => {
    if (preset) {
      setSelectedPreset(preset);
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const habitData = {
      title: selectedPreset?.title || customHabit.title,
      icon: selectedPreset?.icon || customHabit.icon,
      category: selectedCategory!,
      frequency,
      days: frequency === 'custom' ? selectedDays : [],
      time: preferredTime === 'custom' ? customTime : undefined,
      reminder,
      isCustom: !selectedPreset
    };

    onCreateHabit(habitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-gray-900">Paso {step} de 3</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>

        <div className="p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
          {step === 1 && (
            <CategorySelection
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                setStep(2);
              }}
            />
          )}
          {step === 2 && selectedCategory && (
            <HabitSelection
              selectedCategory={selectedCategory}
              onSelectPreset={handleSelectPreset}
              onCustomHabit={() => {
                setIsCustom(true);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <FrequencySettings
              frequency={frequency}
              selectedDays={selectedDays}
              preferredTime={preferredTime}
              customTime={customTime}
              reminder={reminder}
              onUpdateSettings={(updates) => {
                if ('frequency' in updates) setFrequency(updates.frequency!);
                if ('selectedDays' in updates) setSelectedDays(updates.selectedDays!);
                if ('preferredTime' in updates) setPreferredTime(updates.preferredTime!);
                if ('customTime' in updates) setCustomTime(updates.customTime!);
                if ('reminder' in updates) setReminder(updates.reminder!);
              }}
              onBack={() => setStep(2)}
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="flex-1 py-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
              >
                Atrás
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                disabled={step === 1 && !selectedCategory || (step === 2 && isCustom && (!customHabit.title || !customHabit.icon))}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={frequency === 'custom' && selectedDays.length === 0}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear hábito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}