import React, { useState, useEffect } from 'react';
import { Home, Users, Copy, Check, Plus, X, Mail, UserPlus, UserMinus, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { JoinHouseholdModal } from './JoinHouseholdModal';
import { motion, AnimatePresence } from 'framer-motion';

interface HouseholdSectionProps {
  userId: string;
  householdId: string | null;
  onUpdate: () => void;
}

interface HouseholdMember {
  id: string;
  full_name: string;
  user_id: string;
  email: string;
}

export function HouseholdSection({ userId, householdId, onUpdate }: HouseholdSectionProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [householdDetails, setHouseholdDetails] = useState<{ id: string; created_at: string } | null>(null);

  // Agregar log para ver los props
  React.useEffect(() => {
    console.log('HouseholdSection props:', { userId, householdId });
  }, [userId, householdId]);

  // Cargar miembros del hogar
  React.useEffect(() => {
    if (householdId) {
      fetchHouseholdMembers();
    }
  }, [householdId]);

  // Cargar detalles del household cuando cambie householdId
  React.useEffect(() => {
    console.log('Loading household details for:', householdId);
    if (householdId) {
      loadHouseholdDetails();
    } else {
      console.log('No household ID provided');
      setHouseholdDetails(null);
    }
  }, [householdId]);

  const fetchHouseholdMembers = async () => {
    try {
      if (!householdId) {
        console.log('No hay householdId, no se pueden obtener miembros');
        return;
      }

      console.log('Obteniendo miembros para household:', householdId);

      // Consulta directa sin joins innecesarios
      const { data: householdMembers, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, linked_household_id')
        .eq('linked_household_id', householdId)
        .order('full_name');

      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }

      setMembers(householdMembers || []);
      setLoading(false);

    } catch (error) {
      console.error('Error detallado al obtener miembros:', error);
      setLoading(false);
    }
  };

  // Modificamos la suscripción para ser más precisa
  useEffect(() => {
    if (!householdId) return;

    console.log('Iniciando suscripción para household:', householdId);
    
    // Cargar miembros iniciales
    fetchHouseholdMembers();

    // Suscribirse a cambios
    const channel = supabase
      .channel(`profiles_changes_${householdId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
          // Removemos el filtro para ver todos los cambios
        },
        (payload) => {
          console.log('Cambio detectado en profiles:', payload);
          // Verificamos si el cambio afecta a nuestro household
          const record = payload.new as { linked_household_id: string } | null;
          console.log('Nuevo estado del registro:', record);
          
          if (record?.linked_household_id === householdId || 
              (payload.old as { linked_household_id: string })?.linked_household_id === householdId) {
            console.log('Cambio relevante detectado, actualizando miembros...');
            fetchHouseholdMembers();
          }
        }
      )
      .subscribe((status) => {
        console.log('Estado de la suscripción:', status);
      });

    return () => {
      console.log('Limpiando suscripción');
      channel.unsubscribe();
    };
  }, [householdId]);

  const loadHouseholdDetails = async () => {
    try {
      console.log('Fetching household details for ID:', householdId);
      const { data, error } = await supabase
        .from('households')
        .select('id, created_at')
        .eq('id', householdId)
        .single();

      if (error) {
        console.error('Error fetching household:', error);
        throw error;
      }
      
      console.log('Household details loaded:', data);
      setHouseholdDetails(data);
    } catch (error) {
      console.error('Error loading household details:', error);
      setHouseholdDetails(null);
    }
  };

  const createHousehold = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Crear el household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ created_by: userId })
        .select()
        .single();

      if (householdError) throw householdError;

      // 2. Actualizar el perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ linked_household_id: household.id })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // 3. Cargar los detalles inmediatamente
      setHouseholdDetails(household);
      
      // 4. Actualizar el estado local
      if (household.id) {
        await fetchHouseholdMembers();
        await loadHouseholdDetails();
      }

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
        .update({ linked_household_id: null })
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
        .select('id, linked_household_id, email')
        .eq('email', inviteEmail)
        .single();

      if (userError) {
        throw new Error('Usuario no encontrado');
      }

      if (existingUser.linked_household_id) {
        throw new Error('El usuario ya pertenece a otro hogar');
      }

      // Enviar email de invitación
      const { error: emailError } = await supabase.functions.invoke('send-household-invite', {
        body: {
          email: inviteEmail,
          householdId,
          invitedBy: userId
        }
      });

      if (emailError) throw emailError;

      setInviteEmail('');
      setShowInvite(false);
      alert('Invitación enviada correctamente');
    } catch (error) {
      console.error('Error inviting member:', error);
      setError(error instanceof Error ? error.message : 'Error al invitar miembro');
    } finally {
      setLoading(false);
    }
  };

  const copyHouseholdId = () => {
    if (householdDetails?.id) {
      navigator.clipboard.writeText(householdDetails.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      <div className="p-4 border-b border-rose-100/20 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-100 p-2 rounded-lg">
              <Home className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="font-medium text-gray-900">Mi Hogar</h3>
          </div>
          {householdId && (
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <Settings size={20} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {!householdId ? (
          <div className="text-center py-6">
            <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-gray-600 mb-4">
              No perteneces a ningún hogar. Crea uno nuevo o únete a uno existente.
            </p>
            <div className="flex flex-col space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createHousehold}
                disabled={loading}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity shadow-md"
              >
                <UserPlus size={18} />
                <span>Crear Hogar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowJoin(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors"
              >
                <Home size={18} />
                <span>Unirse a un Hogar</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ID del hogar con estado de carga */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-rose-50/30 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-2">
                <Home size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {loading ? (
                    'Creando hogar...'
                  ) : householdDetails?.id ? (
                    `ID: ${householdDetails.id}`
                  ) : (
                    'Cargando ID...'
                  )}
                </span>
              </div>
              <button
                onClick={copyHouseholdId}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Copiar ID"
                disabled={loading || !householdDetails?.id}
              >
                {copied ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} className="text-gray-500" />
                )}
              </button>
            </div>

            {/* Mostrar mensaje de éxito cuando se crea */}
            {householdDetails?.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 bg-green-50 p-2 rounded-lg"
              >
                ¡Hogar creado exitosamente!
              </motion.div>
            )}

            {/* Fecha de creación */}
            {householdDetails && (
              <div className="text-sm text-gray-500 px-1">
                Creado el: {new Date(householdDetails.created_at).toLocaleDateString()}
              </div>
            )}

            {/* Lista de miembros */}
            {loading ? (
              <div className="text-gray-500">Cargando miembros...</div>
            ) : members.length > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Miembros ({members.length}):
                </div>
                {members.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-2 bg-white/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-500 text-sm">
                          {member.full_name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.full_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.user_id === userId ? '(Tú)' : member.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-4">
                No hay miembros en este hogar
              </div>
            )}

            {/* Invitar miembro */}
            <AnimatePresence>
              {showInvite && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100">
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
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={inviteMember}
                        disabled={loading || !inviteEmail}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <UserPlus size={18} />
                        <span>Invitar</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Salir del hogar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={leaveHousehold}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-4"
            >
              <UserMinus size={18} />
              <span>Salir del Hogar</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Modal para unirse a un hogar */}
      {showJoin && (
        <JoinHouseholdModal
          onClose={() => setShowJoin(false)}
          onJoin={onUpdate}
        />
      )}
    </div>
  );
}