import React from 'react';
import { Check, Target, Calendar, Scale, Apple } from 'lucide-react';

export function GuideInfo() {
  const sections = [
    {
      title: 'Principios básicos',
      icon: Target,
      color: 'rose',
      items: [
        'Usa un plato de 23-25 cm de diámetro',
        'Mantén las proporciones indicadas',
        'Bebe agua como bebida principal',
        'Evita salsas y aderezos calóricos'
      ]
    },
    {
      title: 'Beneficios',
      icon: Apple,
      color: 'emerald',
      items: [
        'Control natural de porciones',
        'Aporte equilibrado de nutrientes',
        'Mayor saciedad y energía estable',
        'Fácil de implementar y mantener'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map(section => (
        <div key={section.title} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-rose-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`bg-${section.color}-50 p-3 rounded-xl`}>
              <section.icon className={`w-6 h-6 text-${section.color}-500`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
          </div>

          <ul className="space-y-4">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start space-x-3 group">
                <div className={`p-1.5 rounded-lg bg-${section.color}-50 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                  <Check className={`w-4 h-4 text-${section.color}-500`} />
                </div>
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}