import React, { useState } from 'react';
import { X, Target, Calendar, Clock, Trophy } from 'lucide-react';

interface MeditationGoalsProps {
  onClose: () => void;
}

export function MeditationGoals({ onClose }: MeditationGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    {
      id: 'beginner',
      title: 'Principiante',
      description: '5 minutos diarios durante 1 semana',
      duration: '5 minutos',
      frequency: 'Diario',
      period: '1 semana',
      tips: [
        'Medita a la misma hora cada día',
        'Usa una aplicación de guía',
        'Encuentra un lugar tranquilo'
      ]
    },
    {
      id: 'intermediate',
      title: 'Intermedio',
      description: '10 minutos diarios durante 2 semanas',
      duration: '10 minutos',
      frequency: 'Diario',
      period: '2 semanas',
      tips: [
        'Experimenta diferentes técnicas',
        'Lleva un diario de meditación',
        'Únete a un grupo de meditación'
      ]
    },
    {
      id: 'advanced',
      title: 'Avanzado',
      description: '20 minutos diarios durante 1 mes',
      duration: '20 minutos',
      frequency: 'Diario',
      period: '1 mes',
      tips: [
        'Practica en diferentes momentos del día',
        'Incorpora mindfulness en actividades diarias',
        'Asiste a retiros de meditación'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg text-white">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Objetivos de meditación</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            {goals.map(goal => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedGoal === goal.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">{goal.title}</h4>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-600">{goal.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-600">{goal.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-600">{goal.period}</span>
                    </div>
                  </div>

                  {selectedGoal === goal.id && (
                    <div className="mt-4 space-y-2">
                      <h5 className="font-medium text-gray-900">Consejos:</h5>
                      <ul className="space-y-1">
                        {goal.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <span className="text-indigo-500">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-xl hover:from-indigo-500 hover:to-purple-600 transition-colors disabled:opacity-50"
            disabled={!selectedGoal}
          >
            Establecer objetivo
          </button>
        </div>
      </div>
    </div>
  );
}