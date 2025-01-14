import React, { useState, useEffect } from 'react';
import { 
  ChefHat, Users, Calendar, Search, Filter, ArrowUpDown, 
  Activity, Heart, Scale, LogOut, Settings, User, Mail, 
  Clock, Building, FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { useFavorites } from '../../hooks/useFavorites';
import { supabase } from '../../lib/supabase';
import { PatientDetailsModal } from './PatientDetailsModal';

interface Patient {
  id: string;
  full_name: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  user_type: string;
}

interface ProfileData {
  full_name: string;
  specialization: string | null;
  license_number: string | null;
  created_at: string;
  email: string;
}

export function NutritionistProfile() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { menuItems } = useActiveMenu();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        ...profile,
        email: user.email || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'user');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/menu');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortBy === 'name') {
      return a.full_name.localeCompare(b.full_name);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      {profileData && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profileData.full_name}</h1>
                <p className="text-emerald-100">Nutricionista</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {/* TODO: Implement settings */}}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="Configuración"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
              <Mail size={16} className="text-emerald-100" />
              <span className="text-sm">{profileData.email}</span>
            </div>
            {profileData.specialization && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                <Building size={16} className="text-emerald-100" />
                <span className="text-sm">{profileData.specialization}</span>
              </div>
            )}
            {profileData.license_number && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                <FileCheck size={16} className="text-emerald-100" />
                <span className="text-sm">Licencia: {profileData.license_number}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/20 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Users size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/20 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Calendar size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Menús Activos</p>
              <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/20 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Heart size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recetas</p>
              <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/20 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Activity size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Seguimientos</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Management */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <Users size={24} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Pacientes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown size={18} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              className="flex-1 px-3 py-2.5 bg-white rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="name">Nombre</option>
              <option value="date">Fecha de registro</option>
            </select>
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando pacientes...</p>
            </div>
          ) : (
            <>
              {sortedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-all hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <User size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{patient.full_name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={14} className="text-emerald-400" />
                        <p className="text-sm text-gray-500">
                          Registrado: {new Date(patient.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}

              {sortedPatients.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No hay pacientes</h3>
                  <p className="text-gray-500 mt-1">No se encontraron usuarios registrados</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}