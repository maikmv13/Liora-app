// Constantes para las opciones de frecuencia
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diario', description: 'Todos los días' },
  { value: 'weekdays', label: 'Entre semana', description: 'De lunes a viernes' },
  { value: 'weekends', label: 'Fines de semana', description: 'Sábados y domingos' },
  { value: 'custom', label: 'Personalizado', description: 'Días específicos' }
];

export const WEEK_DAYS = [
  { value: 'monday', label: 'Lunes', short: 'L' },
  { value: 'tuesday', label: 'Martes', short: 'M' },
  { value: 'wednesday', label: 'Miércoles', short: 'X' },
  { value: 'thursday', label: 'Jueves', short: 'J' },
  { value: 'friday', label: 'Viernes', short: 'V' },
  { value: 'saturday', label: 'Sábado', short: 'S' },
  { value: 'sunday', label: 'Domingo', short: 'D' }
];

export const TIME_OPTIONS = [
  { value: 'morning', label: 'Mañana', icon: '🌅', time: '08:00' },
  { value: 'afternoon', label: 'Tarde', icon: '☀️', time: '14:00' },
  { value: 'evening', label: 'Noche', icon: '🌙', time: '20:00' },
  { value: 'custom', label: 'Personalizado', icon: '⚡', time: 'custom' }
];

export const ICON_CATEGORIES = [
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

export const PRESET_HABITS = {
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