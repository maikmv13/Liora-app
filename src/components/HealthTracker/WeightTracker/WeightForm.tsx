import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface WeightFormProps {
  onSubmit: (weight: number) => void;
}

export function WeightForm({ onSubmit }: WeightFormProps) {
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight) {
      onSubmit(parseFloat(weight));
      setWeight('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-rose-100/20">
      <div className="flex gap-2 md:gap-3">
        <div className="flex-1">
          <input
            type="number"
            step="0.1"
            placeholder="Registrar peso (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base rounded-lg md:rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <button
          type="submit"
          disabled={!weight}
          className="flex items-center justify-center space-x-1 md:space-x-2 px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white text-sm md:text-base rounded-lg md:rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          <span>Añadir</span>
        </button>
      </div>
    </form>
  );
}