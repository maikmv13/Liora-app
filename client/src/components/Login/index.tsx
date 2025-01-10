import { useState } from 'react';
import type { ReactNode } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, UserCog, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Register } from '../Register';

interface LoginProps {
  readonly onClose: () => void;
  readonly onLoginSuccess?: () => void;
}

export function Login({ onClose, onLoginSuccess }: LoginProps): ReactNode {
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

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        const errorMessages: Record<string, string> = {
          'Invalid login': 'Correo electrónico o contraseña incorrectos',
          'Email not confirmed': 'Por favor, confirma tu correo electrónico'
        };
        
        const message = errorMessages[signInError.message as keyof typeof errorMessages] || signInError.message;
        throw new Error(message);
      }

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.message.includes('Results contain 0 rows')) {
            throw new Error('Perfil no encontrado. Por favor, contacta con soporte.');
          }
          throw profileError;
        }
        
        if (userType && profile.user_type !== userType) {
          const userTypeText = userType === 'user' ? 'usuario' : 'nutricionista';
          throw new Error(`Esta cuenta no está registrada como ${userTypeText}`);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        
        {!userType && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUserType('user')}
              className={`flex-1 p-4 rounded-lg border ${
                userType === 'user'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              } flex flex-col items-center gap-2 transition-colors`}
            >
              <User className="w-6 h-6" />
              <span>Usuario</span>
            </button>
            
            <button
              onClick={() => setUserType('nutritionist')}
              className={`flex-1 p-4 rounded-lg border ${
                userType === 'nutritionist'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              } flex flex-col items-center gap-2 transition-colors`}
            >
              <UserCog className="w-6 h-6" />
              <span>Nutricionista</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="ejemplo@correo.com"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-12 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="text-primary hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}