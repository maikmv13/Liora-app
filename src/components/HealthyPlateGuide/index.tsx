import React, { useState } from 'react';
import { ChevronRight, Apple, Carrot, Fish, Wheat, Info, Check, Target, Utensils, Activity } from 'lucide-react';
import { foodGroups } from './data';
import { FoodGroup } from './FoodGroup';
import { StaticPlate } from './StaticPlate';
import { GuideInfo } from './GuideInfo';
import { ConsumptionTable } from './ConsumptionTable';
import { PhysicalActivity } from './PhysicalActivity';

export function HealthyPlateGuide() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showConsumptionTable, setShowConsumptionTable] = useState(false);
  const [showPhysicalActivity, setShowPhysicalActivity] = useState(false);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex items-center space-x-3">
        <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <Utensils className="w-6 h-6 md:w-7 md:h-7 text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Método del Plato</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            🍽️ Guía visual para una alimentación saludable
          </p>
        </div>
      </div>

      {/* Introducción */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-100">
        <div className="flex items-start space-x-4">
          <div className="bg-white p-3 rounded-xl">
            <Target className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Qué es el método del plato?
            </h3>
            <p className="text-gray-600">
              Es una guía visual simple que te ayuda a crear comidas nutritivas y equilibradas sin necesidad de pesar alimentos o contar calorías. Divide tu plato en proporciones específicas para cada grupo de alimentos.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => setShowConsumptionTable(!showConsumptionTable)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-colors border border-rose-100"
              >
                <Info size={18} />
                <span>Ver frecuencia de consumo</span>
                <ChevronRight 
                  size={18} 
                  className={`transform transition-transform ${showConsumptionTable ? 'rotate-90' : ''}`} 
                />
              </button>
              <button
                onClick={() => setShowPhysicalActivity(!showPhysicalActivity)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-colors border border-rose-100"
              >
                <Activity size={18} />
                <span>Actividad física</span>
                <ChevronRight 
                  size={18} 
                  className={`transform transition-transform ${showPhysicalActivity ? 'rotate-90' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConsumptionTable && <ConsumptionTable />}
      {showPhysicalActivity && <PhysicalActivity />}

      {/* Plato estático */}
      <StaticPlate />

      {/* Información de los grupos de alimentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {foodGroups.map(group => (
          <FoodGroup key={group.id} {...group} />
        ))}
      </div>

      {/* Consejos generales */}
      <GuideInfo />
    </div>
  );
}