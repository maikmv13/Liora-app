import React from 'react';
import { Flower2, Brain, Heart, Sparkles, CloudFog } from 'lucide-react';

export function MeditationTracker() {
  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <Flower2 className="w-6 h-6 md:w-7 md:h-7 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Meditación</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Cultiva la paz interior
          </p>
        </div>
      </div>

      {/* Beneficios */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
        <div className="p-4 border-b border-indigo-100/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900">Beneficios de la meditación</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Beneficios físicos */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <h4 className="font-medium text-gray-900">Beneficios Físicos</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-rose-50 p-3 rounded-xl">
                <span className="text-xl">🫀</span>
                <div>
                  <p className="font-medium text-gray-900">Reduce la presión arterial</p>
                  <p className="text-sm text-gray-600">Mejora la salud cardiovascular</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-rose-50 p-3 rounded-xl">
                <span className="text-xl">😴</span>
                <div>
                  <p className="font-medium text-gray-900">Mejora el sueño</p>
                  <p className="text-sm text-gray-600">Facilita un descanso profundo</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-rose-50 p-3 rounded-xl">
                <span className="text-xl">🧬</span>
                <div>
                  <p className="font-medium text-gray-900">Fortalece el sistema inmune</p>
                  <p className="text-sm text-gray-600">Aumenta las defensas naturales</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios mentales */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              <h4 className="font-medium text-gray-900">Beneficios Mentales</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-indigo-50 p-3 rounded-xl">
                <span className="text-xl">🧠</span>
                <div>
                  <p className="font-medium text-gray-900">Mejora la concentración</p>
                  <p className="text-sm text-gray-600">Mayor claridad y enfoque</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-indigo-50 p-3 rounded-xl">
                <span className="text-xl">😌</span>
                <div>
                  <p className="font-medium text-gray-900">Reduce el estrés</p>
                  <p className="text-sm text-gray-600">Disminuye la ansiedad</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-indigo-50 p-3 rounded-xl">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-medium text-gray-900">Mayor productividad</p>
                  <p className="text-sm text-gray-600">Mejora la toma de decisiones</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios emocionales */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CloudFog className="w-5 h-5 text-violet-500" />
              <h4 className="font-medium text-gray-900">Beneficios Emocionales</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-violet-50 p-3 rounded-xl">
                <span className="text-xl">🌟</span>
                <div>
                  <p className="font-medium text-gray-900">Mayor autoconciencia</p>
                  <p className="text-sm text-gray-600">Conexión con uno mismo</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-violet-50 p-3 rounded-xl">
                <span className="text-xl">🎭</span>
                <div>
                  <p className="font-medium text-gray-900">Equilibrio emocional</p>
                  <p className="text-sm text-gray-600">Mejor gestión de emociones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-violet-50 p-3 rounded-xl">
                <span className="text-xl">💝</span>
                <div>
                  <p className="font-medium text-gray-900">Compasión y empatía</p>
                  <p className="text-sm text-gray-600">Mejores relaciones personales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}