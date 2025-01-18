import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, UserCog, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { FallingEmojis } from '../../LioraChat/components/FallingEmojis';
import { ScreenProps } from './types';

const ERROR_MESSAGES = {
  'Invalid login credentials': 'El correo o la contraseña son incorrectos',
  'Email not confirmed': 'Por favor, confirma tu correo electrónico',
  'Invalid email format': 'El formato del correo electrónico no es válido',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Rate limit exceeded': 'Demasiados intentos. Por favor, espera unos minutos',
  'User not found': 'Usuario no encontrado',
  'Network error': 'Error de conexión. Por favor, verifica tu internet'
};

export function OnboardingLogin({ onNext, onLogin, isFirst }: ScreenProps) {
  const [userType, setUserType] = useState<'user' | 'nutritionist' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    specialization: '',
    licenseNumber: ''
  });

  const validateForm = () => {
    if (!formData.email) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('El formato del correo electrónico no es válido');
      return false;
    }
    if (!formData.password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Intentar iniciar sesión
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        throw signInError;
      }

      if (!user) {
        throw new Error('No se pudo iniciar sesión');
      }

      // 2. Verificar el tipo de usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (profile.user_type !== userType) {
        throw new Error(`Esta cuenta no está registrada como ${userType === 'user' ? 'usuario' : 'nutricionista'}`);
      }

      // 3. Todo correcto, llamar a onLogin
      onLogin?.();

    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar errores específicos
      if (error.message in ERROR_MESSAGES) {
        setError(ERROR_MESSAGES[error.message as keyof typeof ERROR_MESSAGES]);
      } else if (error.message.includes('network')) {
        setError(ERROR_MESSAGES['Network error']);
      } else {
        setError(error.message || 'Error al iniciar sesión');
      }
      
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <FallingEmojis />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-rose-500" />
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1.5"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              ¡Bienvenido! 👋
            </span>
          </h2>
          <p className="text-gray-600">
            Selecciona tu tipo de cuenta para continuar
          </p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setUserType('user')}
            className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200 hover:border-rose-300"
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
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setUserType('nutritionist')}
            className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300"
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
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <FallingEmojis />

      <div className="w-full max-w-sm">
        <button
          onClick={() => setUserType(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Volver</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center">
              {userType === 'user' ? (
                <User className="w-10 h-10 text-rose-500" />
              ) : (
                <UserCog className="w-10 h-10 text-emerald-500" />
              )}
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1.5"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              Iniciar Sesión
            </span>
          </h2>
          <p className="text-gray-600">
            {userType === 'user' ? 'Como Usuario' : 'Como Nutricionista'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError('');
                }}
                className={`w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-rose-500 ${
                  error && error.includes('correo') ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder="tu@email.com"
                required
              />
              <Mail className={`w-5 h-5 absolute left-3 top-3.5 ${
                error && error.includes('correo') ? 'text-red-400' : 'text-rose-400'
              }`} />
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
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError('');
                }}
                className={`w-full pl-10 pr-12 py-3 bg-white/80 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-rose-500 ${
                  error && error.includes('contraseña') ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder="••••••••"
                required
              />
              <Lock className={`w-5 h-5 absolute left-3 top-3.5 ${
                error && error.includes('contraseña') ? 'text-red-400' : 'text-rose-400'
              }`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </motion.div>
          )}

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </motion.button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                ¿No tienes cuenta? <button type="button" className="text-rose-500 hover:text-rose-600 font-medium">Regístrate aquí</button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}