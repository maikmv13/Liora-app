import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, UserCog, Loader2, Briefcase, FileCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RegisterProps {
  readonly onClose: () => void;
  readonly onRegisterSuccess?: () => void;
  readonly preSelectedUserType: 'user' | 'nutritionist' | null;
  readonly onBack?: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  specialization?: string;
  licenseNumber?: string;
}

export function Register({ onClose, onRegisterSuccess, preSelectedUserType, onBack }: RegisterProps) {
  const [userType, setUserType] = useState<'user' | 'nutritionist' | null>(preSelectedUserType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialization: '',
    licenseNumber: ''
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!userType) {
        throw new Error('Por favor, selecciona un tipo de usuario');
      }

      // Validar campos requeridos
      if (!formData.email || !formData.password || !formData.fullName) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      // Validar contraseñas
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Validar campos de nutricionista
      if (userType === 'nutritionist' && (!formData.specialization || !formData.licenseNumber)) {
        throw new Error('Por favor, completa los campos de especialización y número de licencia');
      }

      // 1. Registrar usuario
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: userType
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // 2. Crear perfil con email
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          user_type: userType,
          email: formData.email,
          specialization: userType === 'nutritionist' ? formData.specialization : null,
          license_number: userType === 'nutritionist' ? formData.licenseNumber : null
        });

      if (profileError) {
        // Si hay error al crear el perfil, intentar eliminar el usuario auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      // Éxito
      alert('Registro exitoso. Ya puedes iniciar sesión.');
      onRegisterSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error en el registro:', err);
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full w-full py-2 px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 mx-auto my-8">
          <div className="space-y-6">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Volver al inicio de sesión</span>
              </button>
            )}

            {userType === null ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
                  <p className="text-gray-600 mt-2">
                    Selecciona el tipo de cuenta que deseas crear
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setUserType('user')}
                    className="flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200 hover:border-rose-300"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <User className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Usuario</h3>
                      <p className="text-sm text-gray-600">
                        Accede a recetas y planes nutricionales
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUserType('nutritionist')}
                    className="flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <UserCog className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Nutricionista</h3>
                      <p className="text-sm text-gray-600">
                        Gestiona pacientes y crea planes
                      </p>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userType === 'nutritionist' ? 'Registro de Nutricionista' : 'Crear cuenta'}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {userType === 'nutritionist'
                      ? 'Completa tus datos profesionales'
                      : 'Únete a nuestra comunidad'}
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="tu@email.com"
                        required
                      />
                      <Mail size={18} className="absolute left-3 top-3 text-rose-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="••••••••"
                        required
                      />
                      <Lock size={18} className="absolute left-3 top-3 text-rose-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-gray-500" />
                        ) : (
                          <Eye size={16} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="••••••••"
                        required
                      />
                      <Lock size={18} className="absolute left-3 top-3 text-rose-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} className="text-gray-500" />
                        ) : (
                          <Eye size={16} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {userType === 'nutritionist' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialización
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Ej: Nutrición deportiva"
                            required
                          />
                          <Briefcase size={18} className="absolute left-3 top-3 text-rose-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de licencia
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Ej: 123456-N"
                            required
                          />
                          <FileCheck size={18} className="absolute left-3 top-3 text-rose-400" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Creando cuenta...</span>
                        </>
                      ) : (
                        <span>Crear cuenta</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onBack || onClose}
                      className="w-full py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm"
                    >
                      {onBack ? 'Volver al inicio de sesión' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}