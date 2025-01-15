import React, { useState } from 'react';
import { 
  Activity, ChevronRight, Target, Clock, Calendar, 
  Music, Heart, CheckCircle2, Trophy, ArrowUpRight 
} from 'lucide-react';

export function PhysicalActivity() {
  const [showBenefits, setShowBenefits] = useState(false);

  const benefits = [
    {
      title: 'Beneficios Físicos',
      icon: <Activity className="w-5 h-5 text-emerald-500" />,
      items: [
        'Mejora la condición física general',
        'Fortalece el sistema cardiovascular',
        'Mejora la postura corporal',
        'Ayuda a mantener un peso saludable',
        'Aumenta la resistencia y fuerza muscular'
      ]
    },
    {
      title: 'Beneficios Psicológicos',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      items: [
        'Reduce la ansiedad y el estrés',
        'Mejora la autoestima',
        'Aumenta la sensación de bienestar',
        'Ayuda a controlar la agresividad',
        'Mejora la calidad del sueño'
      ]
    }
  ];

  const tips = [
    {
      title: 'TODOS LOS PASOS CUENTAN',
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      description: 'Dejar a un lado el ascensor y escoger las escaleras, moverte caminando en lugar de utilizar el coche, mantenerte activo en casa son pequeños gestos que suman al final del día.'
    },
    {
      title: 'PONLO POR ESCRITO',
      icon: <Calendar className="w-5 h-5 text-rose-500" />,
      description: 'Ya sea en tu agenda o en el calendario, planifica los días que vas a hacer ejercicio. Te ayudará a establecer una rutina y comprometerte con el objetivo.'
    },
    {
      title: 'QUE TE GUSTE LO QUE HACES',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      description: 'Sin verte influido/a por la moda del momento, escoge una actividad que te motive y sobre todo que te guste. Esto hará que te sea más fácil llevarlo a cabo.'
    },
    {
      title: 'PONLE MÚSICA',
      icon: <Music className="w-5 h-5 text-rose-500" />,
      description: 'Está demostrado que ponerle música a tu rutina de ejercicios aumenta la motivación, ¡así que dale al play!'
    },
    {
      title: 'PACIENCIA',
      icon: <Clock className="w-5 h-5 text-rose-500" />,
      description: 'Aunque es desesperante no ver resultados inmediatamente, es necesario ser consciente de que los beneficios serán vistos a largo plazo.'
    },
    {
      title: 'HAZ TU MÍNIMO',
      icon: <Target className="w-5 h-5 text-rose-500" />,
      description: 'Cuando todo falle, haz tu mínimo. Esto significa realizar el mínimo de actividad que puedas, aunque sea salir solo 5 minutos. Hará que tu objetivo continúe visible.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Introducción */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-100">
        <div className="flex items-start space-x-4">
          <div className="bg-white p-3 rounded-xl">
            <Trophy className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              La importancia de mantenerse activo
            </h3>
            <p className="text-gray-600">
              Llevar una vida físicamente activa conlleva numerosos beneficios tanto físicos como psicológicos. Por el contrario, el sedentarismo está relacionado con el desarrollo de enfermedades crónicas, por lo que realizar ejercicio con regularidad es muy necesario.
            </p>
            <button
              onClick={() => setShowBenefits(!showBenefits)}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-colors border border-rose-100"
            >
              <CheckCircle2 size={18} />
              <span>Ver beneficios detallados</span>
              <ChevronRight 
                size={18} 
                className={`transform transition-transform ${showBenefits ? 'rotate-90' : ''}`} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      {showBenefits && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((section) => (
            <div 
              key={section.title}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                {section.icon}
                <h4 className="font-medium text-gray-900">{section.title}</h4>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start space-x-2">
                    <ArrowUpRight className="w-4 h-4 text-rose-400 mt-1" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Consejos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <div 
            key={tip.title}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 p-4 hover:border-rose-200 transition-colors"
          >
            <div className="flex space-x-3">
              <div className="bg-rose-50 p-2 rounded-lg">
                {tip.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}