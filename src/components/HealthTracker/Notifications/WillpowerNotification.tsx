import React, { useEffect } from 'react';
import { Brain, X } from 'lucide-react';

interface WillpowerNotificationProps {
  points: number;
  onClose: () => void;
}

export function WillpowerNotification({ points, onClose }: WillpowerNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">¡Puntos de voluntad!</h4>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Has ganado <span className="font-medium text-violet-500">+{points} puntos</span>
          </p>
        </div>
      </div>
    </div>
  );
}