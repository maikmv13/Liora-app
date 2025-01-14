import React from 'react';
import { X, User, Calendar, Clock, Mail, Activity } from 'lucide-react';
import { useActiveMenu } from '../../hooks/useActiveMenu';

interface PatientDetailsModalProps {
  patient: {
    id: string;
    full_name: string;
    user_id: string;
    created_at: string;
    updated_at: string | null;
    user_type: string;
  };
  onClose: () => void;
}

export function PatientDetailsModal({ patient, onClose }: PatientDetailsModalProps) {
  const { menuItems } = useActiveMenu(patient.user_id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-50 p-3 rounded-xl">
                <User size={24} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.full_name}</h2>
                <p className="text-emerald-600 font-medium">Paciente</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">ID de Usuario</div>
              <div className="flex items-center space-x-2 text-gray-900">
                <Mail size={16} className="text-emerald-500" />
                <span>{patient.user_id}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Fecha de Registro</div>
              <div className="flex items-center space-x-2 text-gray-900">
                <Calendar size={16} className="text-emerald-500" />
                <span>{new Date(patient.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {patient.updated_at && (
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Última Actualización</div>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Clock size={16} className="text-emerald-500" />
                  <span>{new Date(patient.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Menu Stats */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
              <Activity size={20} className="text-emerald-500" />
              <span>Actividad del Menú</span>
            </h3>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-emerald-600">Menús Activos</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {menuItems.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-emerald-600">Última Actividad</div>
                  <div className="text-sm text-emerald-700">
                    {menuItems.length > 0
                      ? new Date(menuItems[0].recipe.created_at || '').toLocaleDateString()
                      : 'Sin actividad'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {/* TODO: Implement edit patient */}}
              className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Editar Paciente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}