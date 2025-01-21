import React from 'react';
import { X, Book, Brain, Heart, Sun } from 'lucide-react';

interface MeditationGuideProps {
  onClose: () => void;
}

export function MeditationGuide({ onClose }: MeditationGuideProps) {
  const techniques = [
    {
      title: "Respiración consciente",
      icon: <Brain className="w-5 h-5" />,
      steps: [
        "Siéntate cómodamente con la espalda recta",
        "Cierra los ojos suavemente",
        "Respira naturalmente por la nariz",
        "Observa cada inhalación y exhalación",
        "Cuando tu mente divague, vuelve a la respiración"
      ]
    },
    {
      title: "Escaneo corporal",
      icon: <Heart className="w-5 h-5" />,
      steps: [
        "Acuéstate boca arriba",
        "Lleva la atención a los dedos de los pies",
        "Sube gradualmente por todo el cuerpo",
        "Observa las sensaciones en cada área",
        "Relaja cada parte mientras avanzas"
      ]
    },
    {
      title: "Meditación de bondad amorosa",
      icon: <Sun className="w-5 h-5" />,
      steps: [
        "Genera sentimientos de amor hacia ti mismo",
        "Extiende estos sentimientos a seres queridos",
        "Incluye a personas neutrales",
        "Abarca a personas difíciles",
        "Finalmente, a todos los seres"
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
                <Book className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Guía de meditación</h3>
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
          <div className="space-y-6">
            {techniques.map((technique, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg text-white">
                    {technique.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{technique.title}</h4>
                </div>
                <ol className="space-y-2 ml-4">
                  {technique.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-600 flex items-start space-x-2">
                      <span className="text-indigo-500 font-medium">{stepIndex + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-xl hover:from-indigo-500 hover:to-purple-600 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}