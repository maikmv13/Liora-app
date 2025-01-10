import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, UserCog } from 'lucide-react';

interface LoginProps {
  onClose: () => void;
}

export function Login({ onClose }: LoginProps) {
  const [userType, setUserType] = useState<'user' | 'nutritionist' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de login
    console.log('Login:', { userType, email, password });
  };

  const renderUserTypeSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido/a! 👋</h2>
        <p className="text-gray-600 mt-2">
          Selecciona tu tipo de cuenta para continuar
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
              Accede a tus recetas y plan nutricional
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
              Gestiona tus pacientes y planes
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderLoginForm = () => {
    const isNutritionist = userType === 'nutritionist';
    const gradientColors = isNutritionist
      ? 'from-emerald-400 via-teal-500 to-emerald-600'
      : 'from-orange-400 via-pink-500 to-rose-500';
    const accentColor = isNutritionist ? 'emerald' : 'rose';

    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setUserType(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            <span>Volver</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-900">
            {isNutritionist ? 'Portal Nutricionistas' : 'Iniciar Sesión'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isNutritionist
              ? 'Accede a tu panel de control profesional'
              : 'Bienvenido de nuevo a MiCocina'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-${accentColor}-100 rounded-xl focus:ring-2 focus:ring-${accentColor}-500 focus:border-${accentColor}-500`}
                placeholder="tu@email.com"
                required
              />
              <Mail size={18} className={`absolute left-3 top-3 text-${accentColor}-400`} />
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
                className={`w-full pl-10 pr-12 py-2.5 bg-white/90 backdrop-blur-sm border border-${accentColor}-100 rounded-xl focus:ring-2 focus:ring-${accentColor}-500 focus:border-${accentColor}-500`}
                placeholder="••••••••"
                required
              />
              <Lock size={18} className={`absolute left-3 top-3 text-${accentColor}-400`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-2.5 p-1 hover:bg-${accentColor}-50 rounded-lg transition-colors`}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-gray-500" />
                ) : (
                  <Eye size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className={`h-4 w-4 text-${accentColor}-500 focus:ring-${accentColor}-500 border-gray-300 rounded`}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            <button
              type="button"
              className={`text-sm font-medium text-${accentColor}-600 hover:text-${accentColor}-500`}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-gradient-to-r ${gradientColors} text-white rounded-xl hover:opacity-90 transition-opacity font-medium`}
          >
            Iniciar sesión
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className={`font-medium text-${accentColor}-600 hover:text-${accentColor}-500`}
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
        </div>

        {userType === null ? renderUserTypeSelection() : renderLoginForm()}
      </div>
    </div>
  );
}