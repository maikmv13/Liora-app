import React, { useState } from 'react';
import { ChevronRight, Apple, Carrot, Fish, Wheat, Info, Check, Target, Utensils, Activity, Plus, Wand2 } from 'lucide-react';
import { foodGroups } from './data';
import { FoodGroup } from './FoodGroup';
import { StaticPlate } from './StaticPlate';
import { GuideInfo } from './GuideInfo';
import { ConsumptionTable } from './ConsumptionTable';
import { PhysicalActivity } from './PhysicalActivity';
import { PlateCreator } from './PlateCreator';

export function HealthyPlateGuide() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showConsumptionTable, setShowConsumptionTable] = useState(false);
  const [showPhysicalActivity, setShowPhysicalActivity] = useState(false);
  const [showPlateCreator, setShowPlateCreator] = useState(false);

  return (
    <div className="space-y-8">
      {/* Hero Section con animación */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-rose-50 rounded-3xl p-8 border border-rose-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-rose-100">
                <Utensils className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Método del Plato</h2>
                <p className="text-gray-600 mt-2">
                  Una guía visual simple para crear comidas nutritivas y equilibradas
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowConsumptionTable(!showConsumptionTable)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white transition-colors border border-rose-100 shadow-sm"
              >
                <Info className="w-5 h-5" />
                <span>Frecuencia de consumo</span>
                <ChevronRight 
                  className={`w-5 h-5 transform transition-transform ${showConsumptionTable ? 'rotate-90' : ''}`} 
                />
              </button>
              <button
                onClick={() => setShowPhysicalActivity(!showPhysicalActivity)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white transition-colors border border-rose-100 shadow-sm"
              >
                <Activity className="w-5 h-5" />
                <span>Actividad física</span>
                <ChevronRight 
                  className={`w-5 h-5 transform transition-transform ${showPhysicalActivity ? 'rotate-90' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-br from-rose-100/20 to-orange-100/20 rounded-full blur-3xl" />
        <div className="absolute -left-8 -top-8 w-32 h-32 bg-gradient-to-br from-orange-100/20 to-rose-100/20 rounded-full blur-2xl" />
      </div>

      {showConsumptionTable && <ConsumptionTable />}
      {showPhysicalActivity && <PhysicalActivity />}

      {/* Plato interactivo */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-rose-100 p-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Composición del Plato Saludable
          </h3>
          <p className="text-gray-600 mb-6">
            Divide tu plato en estas proporciones para crear comidas equilibradas y nutritivas
          </p>
          <button
            onClick={() => setShowPlateCreator(true)}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm group"
          >
            <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Crear mi plato personalizado</span>
          </button>
        </div>

        <StaticPlate />
      </div>

      {/* Información de los grupos de alimentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {foodGroups.map(group => (
          <FoodGroup key={group.id} {...group} />
        ))}
      </div>

      {/* Consejos generales */}
      <GuideInfo />

      {/* Modal del creador de platos */}
      {showPlateCreator && (
        <PlateCreator onClose={() => setShowPlateCreator(false)} />
      )}
    </div>
  );
}