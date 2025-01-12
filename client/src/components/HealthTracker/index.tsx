import React, { useState } from 'react';
import { WeightTracker } from './WeightTracker';
import { WaterTracker } from './WaterTracker';
import { ExerciseTracker } from './ExerciseTracker';
import { Activities } from './Activities';
import { GlobalStats } from './GlobalStats';
import { Scale, Droplets, Dumbbell, Activity } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export function HealthTracker() {
  const [activeTab, setActiveTab] = useState('weight');
  const { addXP } = useHealth();

  const handleXPGain = (xp: number) => {
    addXP(xp);
  };

  // Recolectar todas las entradas para las estadísticas globales
  const getAllEntries = () => {
    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const waterEntries = JSON.parse(localStorage.getItem('waterEntries') || '[]');
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries') || '[]');

    return [...weightEntries, ...waterEntries, ...exerciseEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Título principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-violet-100 to-indigo-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 md:w-7 md:h-7 text-violet-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Objetivos de Salud</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              💪 Seguimiento de tus metas diarias
            </p>
          </div>
        </div>
      </div>

      {/* Panel de estadísticas globales */}
      <GlobalStats entries={getAllEntries()} />

      {/* Navegación entre trackers */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'weight'
              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Scale className="w-5 h-5" />
          <span>Control de Peso</span>
        </button>
        <button
          onClick={() => setActiveTab('water')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'water'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Droplets className="w-5 h-5" />
          <span>Hidratación</span>
        </button>
        <button
          onClick={() => setActiveTab('exercise')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'exercise'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span>Ejercicio</span>
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'activities'
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span>Actividades</span>
        </button>
      </div>

      {/* Contenido del tracker activo */}
      <div className="transition-all duration-300">
        {activeTab === 'weight' && <WeightTracker onXPGain={handleXPGain} />}
        {activeTab === 'water' && <WaterTracker onXPGain={handleXPGain} />}
        {activeTab === 'exercise' && <ExerciseTracker onXPGain={handleXPGain} />}
        {activeTab === 'activities' && <Activities entries={getAllEntries()} />}
      </div>
    </div>
  );
}