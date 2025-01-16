import React, { useState } from 'react';
import { Home, Users, Copy, Check, Plus, X, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HouseholdSectionProps {
  userId: string;
  householdId: string | null;
  onUpdate: () => void;
}

export function HouseholdSection({ userId, householdId, onUpdate }: HouseholdSectionProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);

  // Cargar miembros del hogar
  React.useEffect(() => {
    if (householdId) {
      loadHouseholdMembers();
    }
  }, [householdId]);

  const loadHouseholdMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('household_id', householdId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading household members:', error);
    }
  };

  const createHousehold = async () => {
    try {
      setLoading(true);
      setError(null);

      // Crear nuevo hogar
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ created_by: userId })
        .select()
        .single();

      if (householdError) throw householdError;

      // Actualizar perfil del usuario
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ household_id: household.id })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      onUpdate();
    } catch (error) {
      console.error('Error creating household:', error);
      setError('Error al crear el hogar');
    } finally {
      setLoading(false);
    }
  };

  const leaveHousehold = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update({ household_id: null })
        .eq('user_id', userId);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      console.error('Error leaving household:', error);
      setError('Error al salir del hogar');
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si el usuario existe
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id, household_id')
        .eq('email', inviteEmail)
        .single();

      if (userError) {
        throw new Error('Usuario no encontrado');
      }

      if (existingUser.household_id) {
        throw new Error('El usuario ya pertenece a otro hogar');
      }

      // Actualizar el perfil del usuario invitado
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ household_id: householdId })
        .eq('id', existingUser.id);

      if (updateError) throw updateError;

      setInviteEmail('');
      setShowInvite(false);
      loadHouseholdMembers();
    } catch (error) {
      console.error('Error inviting member:', error);
      setError(error instanceof Error ? error.message : 'Error al invitar miembro');
    } finally {
      setLoading(false);
    }
  };

  const copyHouseholdId = () => {
    if (householdId) {
      navigator.clipboard.writeText(householdId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      <div className="p-4 border-b border-rose-100/20 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-100 p-2 rounded-lg">
            <Home className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="font-medium text-gray-900">Mi Hogar</h3>
        </div>
      </div>

      <div className="p-4">
        {!householdId ? (
          <div className="text-center py-6">
            <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-gray-600 mb-4">
              No perteneces a ningún hogar. Crea uno nuevo para compartir tu menú con tu familia.
            </p>
            <button
              onClick={createHousehold}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
            >
              <Plus size={18} />
              <span>Crear Hogar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ID del hogar */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <Home size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600">ID: {householdId}</span>
              </div>
              <button
                onClick={copyHouseholdId}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Copiar ID"
              >
                {copied ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} className="text-gray-500" />
                )}
              </button>
            </div>

            {/* Lista de miembros */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Miembros</h4>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{member.full_name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invitar miembro */}
            {showInvite ? (
              <div className="p-4 bg-rose-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Invitar miembro</h4>
                  <button
                    onClick={() => setShowInvite(false)}
                    className="p-1 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Email del miembro"
                      className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500"
                    />
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                  <button
                    onClick={inviteMember}
                    disabled={loading || !inviteEmail}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
                  >
                    <Plus size={18} />
                    <span>Invitar</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowInvite(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors"
              >
                <Plus size={18} />
                <span>Invitar Miembro</span>
              </button>
            )}

            {/* Salir del hogar */}
            <button
              onClick={leaveHousehold}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={18} />
              <span>Salir del Hogar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}