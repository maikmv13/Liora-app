import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Star, Calendar, Activity } from 'lucide-react';
import { useHealth } from '../../contexts/HealthContext';
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
import { motion } from 'framer-motion';

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

export function EnhancedWillpowerChart() {
  const [weeklyPoints, setWeeklyPoints] = useState<number[]>([]);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const { totalXP } = useHealth();

  // Stats data
  const bestDay = Math.max(...weeklyPoints);
  const averagePoints = Math.round(weeklyPoints.reduce((a, b) => a + b, 0) / weeklyPoints.length);
  const streakDays = weeklyPoints.filter(points => points > 0).length;

  // Load and calculate weekly points
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekPoints = Array(7).fill(0);

    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const waterEntries = JSON.parse(localStorage.getItem('waterEntries') || '[]');
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries') || '[]');

    const calculatePoints = (entries: any[], getPoints: (entry: any) => number) => {
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startOfWeek) {
          const dayIndex = entryDate.getDay() - 1;
          if (dayIndex >= 0) {
            weekPoints[dayIndex] += getPoints(entry);
          }
        }
      });
    };

    calculatePoints(weightEntries, () => 50);
    calculatePoints(waterEntries, entry => {
      const dailyGoal = 2000;
      const completion = Math.min(entry.amount / dailyGoal, 1);
      return Math.floor(completion * 100);
    });
    calculatePoints(exerciseEntries, entry => Math.floor(entry.duration / 10) * 20);

    setWeeklyPoints(weekPoints);
  }, [totalXP]);

  const chartData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Puntos de voluntad',
        data: weeklyPoints,
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
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
        borderColor: '#3B82F6',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return context.parsed.y + ' puntos';
          }
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-px bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mejor día</p>
              <p className="text-lg font-bold text-gray-900">{bestDay} pts</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Promedio</p>
              <p className="text-lg font-bold text-gray-900">{averagePoints} pts</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-violet-50">
              <Star className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Racha</p>
              <p className="text-lg font-bold text-gray-900">{streakDays} días</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900">Progreso semanal</span>
            </div>
            {weeklyPoints.every(points => points > 0) && (
              <div className="px-2 py-1 bg-blue-100 rounded-lg">
                <span className="text-xs text-blue-600 font-medium">¡Semana perfecta!</span>
              </div>
            )}
          </div>

          <div className="h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}