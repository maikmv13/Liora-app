import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export function NextWeekCard() {
  const [timeLeft, setTimeLeft] = React.useState<string>('');
  const [shouldShow, setShouldShow] = React.useState(true);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      // Mostrar la tarjeta si:
      // 1. No es domingo O
      // 2. Es domingo antes de las 21:00
      if (now.getDay() === 0 && now.getHours() >= 21) {
        setShouldShow(false);
        return '';
      }

      // Calcular el próximo domingo a las 21:00
      if (now.getDay() === 0) {
        nextSunday.setHours(21, 0, 0, 0);
      } else {
        nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
        nextSunday.setHours(21, 0, 0, 0);
      }

      const difference = nextSunday.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      return `${days}d ${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);

    return () => clearInterval(timer);
  }, []);

  if (!shouldShow) return null;

  // Obtener el próximo lunes
  const getNextMonday = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilMonday = day === 0 ? 1 : 8 - day;
    date.setDate(date.getDate() + daysUntilMonday);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date)
      .replace(/^\w/, c => c.toUpperCase());
  };

  return (
    <div 
      id="next-week-card"
      className="bg-gradient-to-br from-orange-50 to-rose-50 backdrop-blur-md rounded-2xl overflow-hidden h-full border border-orange-200 shadow-lg"
    >
      <div className="px-4 py-3 border-b border-orange-100 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-orange-100">
              <Calendar size={18} className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{getNextMonday()}</h3>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-orange-600 bg-orange-100">
                  Próxima semana
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center justify-center h-[calc(100%-4rem)] text-center space-y-4">
        <div className="p-3 rounded-full bg-orange-100">
          <Clock className="w-8 h-8 text-orange-500" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Nuevo menú en</h4>
          <p className="text-2xl font-bold text-orange-500">{timeLeft}</p>
        </div>
        <p className="text-sm text-gray-600">
          El menú se actualiza cada domingo a las 21:00
        </p>
      </div>
    </div>
  );
} 