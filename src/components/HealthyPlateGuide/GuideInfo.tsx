import React from 'react';
import { Check } from 'lucide-react';

export function GuideInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Principios básicos</h3>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Usa un plato de 23-25 cm de diámetro</span>
          </li>
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Mantén las proporciones indicadas</span>
          </li>
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Bebe agua como bebida principal</span>
          </li>
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Evita salsas y aderezos calóricos</span>
          </li>
        </ul>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Beneficios</h3>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Control natural de porciones</span>
          </li>
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Aporte equilibrado de nutrientes</span>
          </li>
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Mayor saciedad y energía estable</span>
          </li>
          <li className="flex items-start space-x-2 text-gray-600">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Fácil de implementar y mantener</span>
          </li>
        </ul>
      </div>
    </div>
  );
}