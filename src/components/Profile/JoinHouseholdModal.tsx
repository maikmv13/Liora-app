import React, { useState } from 'react';
import { X, Home, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar que el hogar existe
      const { data: household, error: householdError } = await supabase
        .from('households')
        .select<'households', HouseholdRow>('id')
        .eq('id', householdId)
        .single();

      if (householdError || !household) {
        throw new Error('Hogar no encontrado');
      }

      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Actualizar el perfil del usuario
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ household_id: householdId })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onJoin();
      onClose();
    } catch (error) {
      console.error('Error joining household:', error);
      setError(error instanceof Error ? error.message : 'Error al unirse al hogar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6">
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
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !householdId}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
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
      </div>
    </div>
  );
}