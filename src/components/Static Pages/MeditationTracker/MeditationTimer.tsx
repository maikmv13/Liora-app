import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function MeditationTimer() {
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Selector de duración */}
      <div className="flex space-x-2 mb-6">
        {[5, 10, 15, 20].map(mins => (
          <button
            key={mins}
            onClick={() => {
              setDuration(mins * 60);
              setTimeLeft(mins * 60);
              setIsRunning(false);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              duration === mins * 60
                ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'
                : 'bg-white/50 hover:bg-white/80 text-gray-700'
            }`}
          >
            {mins} min
          </button>
        ))}
      </div>

      {/* Temporizador circular */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-current text-gray-200"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-current text-indigo-500"
            strokeWidth="12"
            fill="none"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">
            {formatTime(timeLeft)}
          </span>
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full hover:from-indigo-500 hover:to-purple-600 transition-colors shadow-lg hover:shadow-xl"
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}