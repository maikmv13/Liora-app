import React, { useState } from 'react';
import { X, Home, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface JoinHouseholdModalProps {
  onClose: () => void;
  onJoin: () => void;
}

// Primero definimos el tipo para households
interface HouseholdRow {
  id: string;
  created_by: string;
  created_at: string;
}

export function JoinHouseholdModal({ onClose, onJoin }: JoinHouseholdModalProps) {
  const [householdId, setHouseholdId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId.trim() || isJoining) return;

    try {
      setIsJoining(true);
      setError(null);
      console.log('Iniciando proceso de unión al household:', householdId);

      // Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error obteniendo usuario:', userError);
        throw new Error('Error de autenticación');
      }
      if (!user) throw new Error('Usuario no autenticado');

      console.log('Usuario autenticado:', user.id);

      // Verificar que el hogar existe
      const { data: household, error: householdError } = await supabase
        .from('households')
        .select('id')
        .eq('id', householdId)
        .single();

      if (householdError || !household) {
        console.error('Error verificando household:', householdError);
        throw new Error('Hogar no encontrado');
      }

      console.log('Household encontrado:', household.id);

      // Verificar si el usuario ya está en un hogar
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('linked_household_id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error verificando perfil:', profileError);
        throw profileError;
      }

      if (currentProfile?.linked_household_id) {
        if (currentProfile.linked_household_id === householdId) {
          throw new Error('Ya perteneces a este hogar');
        } else {
          throw new Error('Ya perteneces a otro hogar. Debes salir primero.');
        }
      }

      // Unirse al household
      const { error: joinError } = await supabase
        .from('profiles')
        .update({ linked_household_id: householdId })
        .eq('user_id', user.id);

      if (joinError) {
        console.error('Error uniéndose al household:', joinError);
        throw joinError;
      }

      console.log('Unión exitosa al household');
      onJoin();
      onClose();

    } catch (error) {
      console.error('Error detallado al unirse:', error);
      setError(error instanceof Error ? error.message : 'Error al unirse al hogar');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-100 p-2 rounded-lg">
              <Home className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Unirse a un Hogar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID del Hogar
            </label>
            <input
              type="text"
              value={householdId}
              onChange={(e) => setHouseholdId(e.target.value)}
              placeholder="Ingresa el ID del hogar"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
              required
              disabled={isJoining}
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isJoining}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isJoining || !householdId.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isJoining ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Uniéndose...</span>
                </>
              ) : (
                <span>Unirse al Hogar</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}