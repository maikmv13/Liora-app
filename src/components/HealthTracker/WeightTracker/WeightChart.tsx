import React from 'react';
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
import { Calendar, Target, Star, TrendingDown, TrendingUp, Scale } from 'lucide-react';

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
  subGoals?: Array<{
    weight: number;
    description: string;
  }>;
}

export function WeightChart({ 
  data, 
  targetWeight, 
  completedGoals,
  subGoals = []
}: WeightChartProps) {
  const isGaining = targetWeight > (data[data.length - 1]?.weight || 0);

  const chartData = {
    labels: data.map(entry => new Date(entry.date).toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short'
    })),
    datasets: [
      {
        label: 'Peso (kg)',
        data: data.map(entry => entry.weight),
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
        label: 'Objetivo final',
        data: Array(data.length).fill(targetWeight),
        borderColor: '#22C55E',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      // Añadir líneas para sub-objetivos
      ...subGoals.map((goal, index) => ({
        label: goal.description,
        data: Array(data.length).fill(goal.weight),
        borderColor: `rgba(251, 146, 60, ${0.5 + (index * 0.2)})`,
        borderWidth: 2,
        borderDash: [2, 2],
        fill: false,
        pointRadius: 0
      })),
      {
        label: 'Objetivos completados',
        data: data.map(entry => {
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
        align: 'start' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          },
          boxWidth: 6,
          boxHeight: 6
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
          minRotation: 45,
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
      <div className="p-4 border-b border-rose-100/20">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-rose-500" />
          <h3 className="font-semibold text-gray-900">Evolución del peso</h3>
        </div>
      </div>
      <div className="p-4" style={{ height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}