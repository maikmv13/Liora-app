import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Sparkles, Flame, Info } from 'lucide-react';
import { useHealth } from '../../../contexts/HealthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EnhancedWillpowerChartProps {}

export function EnhancedWillpowerChart({}: EnhancedWillpowerChartProps) {
  const [weeklyPoints, setWeeklyPoints] = useState<number[]>([]);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Get XP data from context
  const { totalXP } = useHealth();

  // Load and calculate weekly points from all activities
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    // Initialize array for week days
    const weekPoints = Array(7).fill(0);

    // Get entries from all activities
    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const waterEntries = JSON.parse(localStorage.getItem('waterEntries') || '[]');
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries') || '[]');

    // Calculate points for each activity type
    const calculatePoints = (entries: any[], getPoints: (entry: any) => number) => {
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startOfWeek) {
          const dayIndex = entryDate.getDay() - 1; // -1 because we start from Monday (0)
          if (dayIndex >= 0) { // Only count Monday-Sunday
            weekPoints[dayIndex] += getPoints(entry);
          }
        }
      });
    };

    // Points calculation rules for each activity
    calculatePoints(weightEntries, entry => {
      // Points for weight tracking: 50 base points
      return 50;
    });

    calculatePoints(waterEntries, entry => {
      // Points for water intake: 10 points per 500ml
      const dailyGoal = 2000; // ml
      const completion = Math.min(entry.amount / dailyGoal, 1);
      return Math.floor(completion * 100);
    });

    calculatePoints(exerciseEntries, entry => {
      // Points for exercise: 20 points per 10 minutes
      return Math.floor(entry.duration / 10) * 20;
    });

    setWeeklyPoints(weekPoints);
  }, [totalXP]); // Update when totalXP changes

  const totalPoints = weeklyPoints.reduce((a, b) => a + b, 0);
  const averagePoints = Math.round(totalPoints / weeklyPoints.length);
  const bestDay = Math.max(...weeklyPoints);
  const streak = weeklyPoints.filter(points => points > 0).length;

  const chartData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Puntos de voluntad',
        data: weeklyPoints,
        fill: true,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => `${context.parsed.y} puntos`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
      axis: 'x' as const
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border border-violet-100 p-6">
      {/* Encabezado con estadísticas */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-lg shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Fuerza de Voluntad</h3>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <p className="text-sm font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                {totalPoints} puntos esta semana
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-600">Mejor día</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{bestDay} pts</span>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-gray-600">Promedio</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{averagePoints} pts</span>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-gray-600">Racha</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{streak} días</span>
        </div>
      </div>

      {/* Gráfico de línea */}
      <div className="h-[300px] mb-6">
        <Line data={chartData} options={options} />
      </div>

      {/* Información adicional */}
      <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500">
        <Info className="w-4 h-4 flex-shrink-0" />
        <p>Los puntos de voluntad se calculan en base a tus actividades diarias: peso (50 pts), agua (hasta 100 pts) y ejercicio (20 pts cada 10 min).</p>
      </div>
    </div>
  );
}