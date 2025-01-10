import React, { useState } from 'react';
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
import { Calendar, ChevronDown } from 'lucide-react';

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

interface WeightChartProps {
  data: {
    date: string;
    weight: number;
  }[];
  targetWeight: number;
  completedGoals: {
    date: string;
    weight: number;
    targetWeight: number;
  }[];
}

type TimeRange = 'week' | 'month' | 'trimester' | 'year' | 'all';

export function WeightChart({ data, targetWeight, completedGoals }: WeightChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [showRangeSelector, setShowRangeSelector] = useState(false);

  const timeRanges = {
    week: { label: 'Última semana', days: 7 },
    month: { label: 'Último mes', days: 30 },
    trimester: { label: 'Último trimestre', days: 90 },
    year: { label: 'Último año', days: 365 },
    all: { label: 'Todo el historial', days: Infinity }
  };

  const filterDataByTimeRange = (range: TimeRange) => {
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - timeRanges[range].days));
    return data.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const filteredData = filterDataByTimeRange(timeRange);

  const chartData = {
    labels: filteredData.map(entry => new Date(entry.date).toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short'
    })),
    datasets: [
      {
        label: 'Peso (kg)',
        data: filteredData.map(entry => entry.weight),
        fill: true,
        borderColor: '#F43F5E',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#F43F5E',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Objetivo',
        data: Array(filteredData.length).fill(targetWeight),
        borderColor: '#22C55E',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Objetivos completados',
        data: filteredData.map(entry => {
          const goal = completedGoals.find(g => g.date === entry.date);
          return goal ? goal.weight : null;
        }),
        borderColor: '#EAB308',
        backgroundColor: '#EAB308',
        pointStyle: 'star',
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#F43F5E',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            if (context.dataset.label === 'Objetivos completados') {
              const goal = completedGoals.find(g => g.date === data[context.dataIndex].date);
              return goal ? `¡Objetivo alcanzado! ${goal.weight} kg` : '';
            }
            return `${context.dataset.label}: ${context.parsed.y} kg`;
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
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
      nearest: true
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
      <div className="p-4 border-b border-rose-100/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Evolución del peso</h3>
          <div className="relative">
            <button
              onClick={() => setShowRangeSelector(!showRangeSelector)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Calendar size={16} />
              <span className="text-sm font-medium">{timeRanges[timeRange].label}</span>
              <ChevronDown size={16} className={`transform transition-transform ${showRangeSelector ? 'rotate-180' : ''}`} />
            </button>

            {showRangeSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-rose-100 py-1 z-10">
                {Object.entries(timeRanges).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTimeRange(key as TimeRange);
                      setShowRangeSelector(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-rose-50 transition-colors ${
                      timeRange === key ? 'text-rose-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4" style={{ height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}