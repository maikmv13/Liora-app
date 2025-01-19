import { toast } from 'react-hot-toast';
import { Brain, X, Heart, CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  type?: 'success' | 'error' | 'welcome';
}

const NotificationComponent = ({ title, message, icon, onClose }: NotificationProps & { onClose: () => void }) => (
  <div className="fixed top-4 right-4 z-50 animate-slide-in">
    <div className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3">
      <div className={`p-2 bg-gradient-to-br ${
        icon === 'success' ? 'from-green-400 to-emerald-500' :
        icon === 'error' ? 'from-red-400 to-rose-500' :
        'from-violet-400 to-fuchsia-500'
      } rounded-lg`}>
        {icon === 'success' ? <CheckCircle className="w-5 h-5 text-white" /> :
         icon === 'error' ? <AlertCircle className="w-5 h-5 text-white" /> :
         icon === 'welcome' ? <Heart className="w-5 h-5 text-white" /> :
         <Brain className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  </div>
);

export const Notifications = {
  welcome: () => {
    toast.custom((t) => (
      <NotificationComponent
        title="¡Bienvenido a Liora! 👋"
        message="Para poder generar tu menú semanal, necesitas marcar como favoritas al menos 2 recetas de cada tipo (desayuno, comida, snack y cena) 🌟"
        icon="welcome"
        onClose={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 6000,
    });
  },

  custom: ({ title, message, icon = '✨' }: NotificationProps) => {
    toast.custom((t) => (
      <NotificationComponent
        title={title}
        message={message}
        icon={icon}
        onClose={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
    });
  },

  success: (message: string) => {
    toast.custom((t) => (
      <NotificationComponent
        title="¡Éxito!"
        message={message}
        icon="success"
        onClose={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
    });
  },

  error: (message: string) => {
    toast.custom((t) => (
      <NotificationComponent
        title="Error"
        message={message}
        icon="error"
        onClose={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
    });
  }
};