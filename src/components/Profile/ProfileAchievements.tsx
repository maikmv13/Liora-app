import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  achieved: boolean;
}

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

export function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Trophy size={20} className="text-rose-500" />
        <span>Logros</span>
      </h2>
      <div className="space-y-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`flex items-center justify-between p-3 rounded-xl ${
              achievement.achieved ? 'bg-amber-50/50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <achievement.icon 
                size={16} 
                className={achievement.achieved ? 'text-amber-500' : 'text-gray-400'} 
              />
              <div>
                <p className={`text-sm font-medium ${
                  achievement.achieved ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-500">{achievement.description}</p>
              </div>
            </div>
            {achievement.achieved && (
              <Star size={16} className="text-amber-500 fill-amber-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}