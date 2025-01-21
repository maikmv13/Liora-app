import React, { useState } from 'react';
import { Plus, X, Clock, Bell, Target, Calendar, ChevronRight, Info, Search, Sparkles } from 'lucide-react';
import type { Habit } from './types';

interface HabitCreatorProps {
  onCreateHabit: (habit: Omit<Habit, 'id' | 'isCompleted'>) => void;
  onClose: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diario', description: 'Todos los días' },
  { value: 'weekdays', label: 'Entre semana', description: 'De lunes a viernes' },
  { value: 'weekends', label: 'Fines de semana', description: 'Sábados y domingos' },
  { value: 'custom', label: 'Personalizado', description: 'Días específicos' }
];

const WEEK_DAYS = [
  { value: 'monday', label: 'Lunes', short: 'L' },
  { value: 'tuesday', label: 'Martes', short: 'M' },
  { value: 'wednesday', label: 'Miércoles', short: 'X' },
  { value: 'thursday', label: 'Jueves', short: 'J' },
  { value: 'friday', label: 'Viernes', short: 'V' },
  { value: 'saturday', label: 'Sábado', short: 'S' },
  { value: 'sunday', label: 'Domingo', short: 'D' }
];

const TIME_OPTIONS = [
  { value: 'morning', label: 'Mañana', icon: '🌅', time: '08:00' },
  { value: 'afternoon', label: 'Tarde', icon: '☀️', time: '14:00' },
  { value: 'evening', label: 'Noche', icon: '🌙', time: '20:00' },
  { value: 'custom', label: 'Personalizado', icon: '⚡', time: 'custom' }
];

const ICON_CATEGORIES = [
  {
    name: 'Actividad Física',
    icons: ['🏃‍♂️', '🚴‍♂️', '🏋️‍♂️', '🧘‍♂️', '🤸‍♂️', '⚽', '🎾', '🏊‍♂️', '🏄‍♂️', '🚶‍♂️', '💪', '🎯']
  },
  {
    name: 'Bienestar Mental',
    icons: ['🧠', '📚', '✍️', '🎨', '🎵', '🎮', '🧩', '🎭', '🎪', '🎯', '🎲', '🎼']
  },
  {
    name: 'Salud',
    icons: ['💊', '🏥', '🧬', '🩺', '🫀', '🧪', '🥗', '🥤', '💧', '🍎', '🥑', '🥦']
  },
  {
    name: 'Productividad',
    icons: ['💼', '💻', '📱', '✉️', '📝', '📅', '⏰', '📊', '📈', '💡', '🎯', '✅']
  },
  {
    name: 'Desarrollo Personal',
    icons: ['🎓', '📚', '💭', '🗣️', '✍️', '📖', '🎯', '🔍', '💪', '🧠', '📝', '💡']
  },
  {
    name: 'Social',
    icons: ['👥', '🤝', '💬', '📞', '💌', '🤗', '👋', '🎉', '🎭', '🎪', '🎮', '🎲']
  }
];

const PRESET_HABITS = {
  physical: {
    name: 'Salud Física',
    color: 'from-blue-400 to-cyan-400',
    icon: '💪',
    habits: [
      { title: 'Ejercicio diario', icon: '🏃‍♂️' },
      { title: 'Estiramientos', icon: '🧘‍♂️' },
      { title: 'Caminar 10.000 pasos', icon: '👣' },
      { title: 'Yoga', icon: '🧘‍♀️' },
      { title: 'Deportes', icon: '⚽' },
      { title: 'Gimnasio', icon: '🏋️‍♂️' }
    ]
  },
  mental: {
    name: 'Salud Mental',
    color: 'from-violet-400 to-purple-400',
    icon: '🧠',
    habits: [
      { title: 'Meditación', icon: '🧘‍♂️' },
      { title: 'Lectura', icon: '📚' },
      { title: 'Journaling', icon: '📝' },
      { title: 'Práctica de gratitud', icon: '🙏' },
      { title: 'Mindfulness', icon: '🌱' },
      { title: 'Aprendizaje', icon: '🎯' }
    ]
  },
  social: {
    name: 'Conexión Social',
    color: 'from-pink-400 to-rose-400',
    icon: '👥',
    habits: [
      { title: 'Llamar a un ser querido', icon: '📞' },
      { title: 'Reunión social', icon: '🤝' },
      { title: 'Voluntariado', icon: '❤️' },
      { title: 'Networking', icon: '💼' },
      { title: 'Tiempo en familia', icon: '👨‍👩‍👧‍👦' },
      { title: 'Actividad grupal', icon: '🎮' }
    ]
  },
  selfcare: {
    name: 'Autocuidado',
    color: 'from-emerald-400 to-teal-400',
    icon: '🌟',
    habits: [
      { title: 'Rutina de skincare', icon: '✨' },
      { title: 'Baño relajante', icon: '🛁' },
      { title: 'Siesta reparadora', icon: '😴' },
      { title: 'Hobby creativo', icon: '🎨' },
      { title: 'Tiempo sin pantallas', icon: '📵' },
      { title: 'Rutina de sueño', icon: '🌙' }
    ]
  },
  productivity: {
    name: 'Productividad',
    color: 'from-amber-400 to-orange-400',
    icon: '⚡',
    habits: [
      { title: 'Planificación diaria', icon: '📅' },
      { title: 'Pomodoro', icon: '🍅' },
      { title: 'Inbox zero', icon: '📧' },
      { title: 'Deep work', icon: '💻' },
      { title: 'Review semanal', icon: '📊' },
      { title: 'Organización', icon: '📁' }
    ]
  }
} as const;

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
      time: preferredTime === 'custom' ? customTime : TIME_OPTIONS.find(t => t.value === preferredTime)?.time,
      reminder,
      isCustom: !selectedPreset
    };

    onCreateHabit(habitData);
    onClose();
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
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
              : step > stepNumber
              ? 'bg-amber-100 text-amber-500'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {step > stepNumber ? '✓' : stepNumber}
          </div>
          {stepNumber !== 3 && (
            <div className={`h-1 flex-1 mx-2 rounded ${
              step > stepNumber
                ? 'bg-amber-100'
                : 'bg-gray-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Elige una categoría
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Selecciona el tipo de hábito que quieres crear
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(PRESET_HABITS).map(([key, category]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedCategory(key as keyof typeof PRESET_HABITS);
              setStep(2);
            }}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              selectedCategory === key
                ? 'border-transparent bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg'
                : 'border-gray-200 hover:border-amber-200'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderHabitSelection = () => {
    if (!selectedCategory) return null;
    const category = PRESET_HABITS[selectedCategory];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
              {category.icon}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <p className="text-sm text-gray-600">Selecciona o crea un hábito</p>
            </div>
          </div>
          <button
            onClick={() => setStep(1)}
            className="text-sm text-amber-600 hover:text-amber-700"
          >
            ← Cambiar categoría
          </button>
        </div>

        <div className="space-y-3">
          {category.habits.map((habit) => (
            <button
              key={habit.title}
              onClick={() => handleSelectPreset(habit)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-amber-200 transition-all hover:scale-[1.02] bg-white"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{habit.icon}</span>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">{habit.title}</h4>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}

          <button
            onClick={() => {
              setIsCustom(true);
              setStep(3);
            }}
            className="w-full p-4 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-300 transition-all hover:scale-[1.02] bg-amber-50/50"
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-amber-600">Crear hábito personalizado</span>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderCustomHabitForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Plus className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Crear hábito personalizado
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Define los detalles de tu nuevo hábito
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del hábito
          </label>
          <input
            type="text"
            value={customHabit.title}
            onChange={(e) => setCustomHabit(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Ej: Meditar, Leer, Ejercicio..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icono
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIconPicker(true)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 hover:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-left flex items-center justify-between"
            >
              <span>{customHabit.icon || 'Seleccionar icono'}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {showIconPicker && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Seleccionar icono</h4>
                <button
                  onClick={() => setShowIconPicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Buscar icono..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-4">
                {ICON_CATEGORIES.map((category) => {
                  const filteredIcons = category.icons.filter(icon =>
                    !iconSearch || icon.toLowerCase().includes(iconSearch.toLowerCase())
                  );

                  if (filteredIcons.length === 0) return null;

                  return (
                    <div key={category.name}>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {category.name}
                      </h5>
                      <div className="grid grid-cols-6 gap-2">
                        {filteredIcons.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => {
                              setCustomHabit(prev => ({ ...prev, icon }));
                              setShowIconPicker(false);
                            }}
                            className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                              customHabit.icon === icon
                                ? 'bg-amber-500 text-white scale-110 shadow-lg'
                                : 'hover:bg-amber-50'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFrequencySettings = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Configura la frecuencia
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Establece cuándo quieres realizar este hábito
        </p>
      </div>

      {/* Frecuencia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frecuencia
        </label>
        <div className="grid grid-cols-2 gap-3">
          {FREQUENCY_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setFrequency(option.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                frequency === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de días específicos */}
      {frequency === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Días de la semana
          </label>
          <div className="flex justify-between">
            {WEEK_DAYS.map(day => (
              <button
                key={day.value}
                onClick={() => {
                  setSelectedDays(prev => 
                    prev.includes(day.value)
                      ? prev.filter(d => d !== day.value)
                      : [...prev, day.value]
                  );
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  selectedDays.includes(day.value)
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hora preferida */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mejor momento del día
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TIME_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setPreferredTime(option.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                preferredTime === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1 block">{option.icon}</span>
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              {option.time !== 'custom' && (
                <p className="text-xs text-gray-500 mt-1">{option.time}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de hora personalizada */}
      {preferredTime === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora específica
          </label>
          <input
            type="time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      )}

      {/* Recordatorios */}
      <div className="bg-amber-50 p-4 rounded-xl">
        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <span className="font-medium text-gray-900">Recordatorios</span>
              <p className="text-sm text-gray-600">
                Recibe notificaciones para mantener tu hábito
              </p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-14 h-8 rounded-full transition-colors ${
                reminder ? 'bg-amber-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  reminder ? 'right-1' : 'left-1'
                } shadow-sm`}
              />
            </div>
          </div>
        </label>
      </div>
    </div>
  );

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
          {renderStepIndicator()}
        </div>

        <div className="p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
          {step === 1 && renderCategorySelection()}
          {step === 2 && (isCustom ? renderCustomHabitForm() : renderHabitSelection())}
          {step === 3 && renderFrequencySettings()}
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