import { Sunrise, Sun, Moon } from 'lucide-react';

export const TIME_SLOTS = {
  morning: { 
    label: 'Mañana', 
    icon: Sunrise, 
    range: [5, 11], 
    gradient: 'from-amber-400 to-orange-500' 
  },
  afternoon: { 
    label: 'Tarde', 
    icon: Sun, 
    range: [12, 18], 
    gradient: 'from-blue-400 to-cyan-500' 
  },
  evening: { 
    label: 'Noche', 
    icon: Moon, 
    range: [19, 4], 
    gradient: 'from-indigo-400 to-violet-500' 
  }
} as const;

export type TimeSlot = keyof typeof TIME_SLOTS;