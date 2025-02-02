import React, { useState } from 'react';
import { X, Target, ChevronRight, Info, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepIndicator } from './components/StepIndicator';
import { CategorySelection } from './components/CategorySelection';
import { HabitSelection } from './components/HabitSelection';
import { FrequencySettings } from './components/FrequencySettings';
import { CustomHabitForm } from './components/CustomHabitForm';
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
  const [iconSearch, setIconSearch] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Configuración de frecuencia
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState('morning');
  const [customTime, setCustomTime] = useState('08:00');
  const [reminder, setReminder] = useState(true);

  const handleSelectPreset = (preset: typeof selectedPreset) => {
    if (preset) {
      setSelectedPreset(preset);
      setStep(4); // Ir a configuración de frecuencia
    }
  };

  const handleCustomHabit = () => {
    setIsCustom(true);
    setStep(3); // Ir al formulario de hábito personalizado
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Header con gradiente */}
        <div className="relative p-6 bg-gradient-to-br from-violet-600 to-indigo-700">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Contenido del header */}
          <div className="relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-white" />
                <span className="font-medium text-white">Paso {step} de 4</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <StepIndicator currentStep={step} totalSteps={4} />
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
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
                  onCustomHabit={handleCustomHabit}
                  onBack={() => setStep(1)}
                  customHabit={customHabit}
                  onUpdateCustomHabit={(updates) => setCustomHabit(prev => ({ ...prev, ...updates }))}
                  showIconPicker={showIconPicker}
                  setShowIconPicker={setShowIconPicker}
                  iconSearch={iconSearch}
                  setIconSearch={setIconSearch}
                />
              )}
              
              {step === 3 && isCustom && (
                <CustomHabitForm
                  customHabit={customHabit}
                  onUpdateCustomHabit={(updates) => setCustomHabit(prev => ({ ...prev, ...updates }))}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                  showIconPicker={showIconPicker}
                  setShowIconPicker={setShowIconPicker}
                  iconSearch={iconSearch}
                  setIconSearch={setIconSearch}
                />
              )}
              
              {step === 4 && (
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
                  onBack={() => setStep(isCustom ? 3 : 2)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer con botones */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
          <div className="flex space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="flex-1 py-2.5 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
              >
                Atrás
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                disabled={step === 1 && !selectedCategory || (step === 3 && isCustom && (!customHabit.title || !customHabit.icon))}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={frequency === 'custom' && selectedDays.length === 0}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Crear hábito
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}