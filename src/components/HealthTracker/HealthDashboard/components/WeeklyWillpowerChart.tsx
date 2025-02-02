import React from 'react';
import { Brain } from 'lucide-react';

interface WeeklyWillpowerChartProps {
  weeklyPoints: number[];
}

export function WeeklyWillpowerChart({ weeklyPoints }: WeeklyWillpowerChartProps) {
  const maxPoints = Math.max(...weeklyPoints, 100); // Ensure minimum scale of 100
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border border-violet-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold text-gray-900">Puntos de voluntad semanales</h3>
        </div>
        <div className="text-sm font-medium text-violet-600">
          {weeklyPoints.reduce((a, b) => a + b, 0)} puntos
        </div>
      </div>

      <div className="flex items-end justify-between h-48 mb-2">
        {weeklyPoints.map((points, index) => {
          const height = (points / maxPoints) * 100;
          
          return (
            <div
              key={index}
              className="relative flex flex-col items-center w-12"
            >
              {/* Barra con efectos de energía */}
              <div className="relative w-8 rounded-lg overflow-hidden" style={{ height: `${height}%` }}>
                {/* Fondo base */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-400 via-fuchsia-500 to-purple-500">
                  {/* Efecto de energía pulsante */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
                  
                  {/* Destellos de energía */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-white/30 to-transparent animate-wave" style={{ animationDuration: '2s' }} />
                  </div>
                </div>

                {/* Aura de energía */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-200/20 via-fuchsia-300/20 to-purple-200/20 animate-pulse" />
              </div>

              {/* Puntos */}
              <div className="absolute top-0 transform -translate-y-6 text-sm font-medium text-violet-600">
                {points}
              </div>

              {/* Día de la semana */}
              <div className="absolute bottom-0 transform translate-y-6 text-sm font-medium text-gray-600">
                {weekDays[index]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}