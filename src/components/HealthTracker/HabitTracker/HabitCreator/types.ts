import { PRESET_HABITS } from './constants';

export interface HabitCreatorProps {
  onCreateHabit: (habit: Omit<Habit, 'id' | 'isCompleted'>) => void;
  onClose: () => void;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface CategorySelectionProps {
  selectedCategory: keyof typeof PRESET_HABITS | null;
  onSelectCategory: (category: keyof typeof PRESET_HABITS) => void;
}

export interface HabitSelectionProps {
  selectedCategory: keyof typeof PRESET_HABITS;
  onSelectPreset: (preset: { title: string; icon: string }) => void;
  onCustomHabit: () => void;
  onBack: () => void;
}

export interface CustomHabitFormProps {
  customHabit: {
    title: string;
    icon: string;
    category: keyof typeof PRESET_HABITS;
  };
  onUpdateCustomHabit: (updates: Partial<CustomHabitFormProps['customHabit']>) => void;
  onBack: () => void;
}

export interface FrequencySettingsProps {
  frequency: string;
  selectedDays: string[];
  preferredTime: string;
  customTime: string;
  reminder: boolean;
  onUpdateSettings: (updates: Partial<FrequencySettingsProps>) => void;
  onBack: () => void;
}

export interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
  onClose: () => void;
}