import React, { useState } from 'react';
import { Scale, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeightFormProps {
  onSubmit: (weight: number) => void;
}

export function WeightForm({ onSubmit }: WeightFormProps) {
  const [weight, setWeight] = useState('');
  const [lastWeight, setLastWeight] = useState(() => {
    const entries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    return entries.length > 0 ? entries[0].weight : null;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight) {
      onSubmit(parseFloat(weight));
      setWeight('');
    }
  };

  const getWeightDifference = () => {
    if (!lastWeight || !weight) return null;
    const diff = parseFloat(weight) - lastWeight;
    return {
      value: Math.abs(diff).toFixed(1),
      isGain: diff > 0
    };
  };

  const weightDiff = getWeightDifference();

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-rose-600/80 to-pink-800/90" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Scale className="w-6 h-6 md:w-8 md:h-8 text-orange-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Registro de Peso
              </h1>
              <p className="text-orange-200 mt-1">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Weight Input */}
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 text-2xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-center"
              placeholder="¿Cuánto pesas hoy?"
              required
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60">
              kg
            </span>
          </div>

          {/* Weight Difference */}
          {weightDiff && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
            >
              {weightDiff.isGain ? (
                <>
                  <TrendingUp className="w-5 h-5 text-red-300" />
                  <span className="text-red-300">+{weightDiff.value} kg</span>
                </>
              ) : weightDiff.value === '0.0' ? (
                <>
                  <Minus className="w-5 h-5 text-blue-300" />
                  <span className="text-blue-300">Sin cambios</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5 text-green-300" />
                  <span className="text-green-300">-{weightDiff.value} kg</span>
                </>
              )}
              <span className="text-white/60">desde el último registro</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!weight}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white text-rose-500 rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
          >
            Registrar Peso
          </motion.button>

          {/* Tip */}
          <div className="flex items-start space-x-2 text-sm text-orange-200">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Para obtener mediciones más precisas, pésate por la mañana después de ir al baño y antes de desayunar.
            </p>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-rose-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-400/20 to-pink-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}