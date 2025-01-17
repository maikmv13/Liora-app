import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, UserCog, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Register } from '../Register';

interface LoginProps {
  readonly onClose: () => void;
  readonly onLoginSuccess?: () => void;
}

export function Login({ onClose, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'user' | 'nutritionist' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!userType) {
        throw new Error('Por favor, selecciona un tipo de usuario');
      }

      // 1. Iniciar sesión
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        const errorMessages: Record<string, string> = {
          'Invalid login credentials': 'Correo electrónico o contraseña incorrectos',
          'Email not confirmed': 'Por favor, confirma tu correo electrónico'
        };
        
        throw new Error(errorMessages[signInError.message] || signInError.message);
      }

      if (user) {
        // 2. Verificar y actualizar el perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        // 3. Actualizar el email en el perfil si es necesario
        if (!profile.email || profile.email !== email) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ email })
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        }
        
        if (userType && profile.user_type !== userType) {
          throw new Error(`Esta cuenta no está registrada como ${userType === 'user' ? 'usuario' : 'nutricionista'}`);
        }

        onLoginSuccess?.();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <Register
        onClose={() => setShowRegister(false)}
        onRegisterSuccess={onLoginSuccess}
        preSelectedUserType={userType}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-100/20">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido! 👋</h2>
          <p className="text-gray-600 mt-2">Inicia sesión para acceder a todas las funciones</p>
        </div>

        {!userType ? (
          <div className="space-y-4">
            <button
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
            </button>

            <button
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
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="ejemplo@correo.com"
                  required
                />
                <Mail className="w-5 h-5 text-rose-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-5 h-5 text-rose-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 hover:bg-rose-50 rounded-lg transition-colors"
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
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="w-full py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-sm"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>

              <button
                type="button"
                onClick={() => setUserType(null)}
                className="w-full py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors text-sm"
              >
                ← Volver a selección de tipo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}