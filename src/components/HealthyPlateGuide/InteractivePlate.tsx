import { useState } from 'react';
import type { ReactNode } from 'react';
import { FoodGroupType } from './types';

interface InteractivePlateProps {
  foodGroups: Array<FoodGroupType>;
  selectedGroup: FoodGroupType | null;
  onSelectGroup: (group: FoodGroupType) => void;
}

interface PathData {
  path: string;
  group: FoodGroupType;
}

interface LabelPosition {
  x: number;
  y: number;
}

export function InteractivePlate({ foodGroups, selectedGroup, onSelectGroup }: InteractivePlateProps): ReactNode {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const calculatePaths = (): PathData[] => {
    const centerX = 50;
    const centerY = 50;
    const radius = 50;

    let startAngle = -90;
    const paths = foodGroups.map(group => {
      const angle = (group.percentage / 100) * 360;
      const endAngle = startAngle + angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      const path = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
      
      startAngle = endAngle;
      return { path, group };
    });

    return paths;
  };

  const getLabelPosition = (percentage: number, index: number): LabelPosition => {
    const angleOffset = -90;
    const totalAngle = 360;
    
    let angleSum = 0;
    for (let i = 0; i < index; i++) {
      angleSum += (foodGroups[i].percentage / 100) * totalAngle;
    }
    const middleAngle = angleOffset + angleSum + ((percentage / 100) * totalAngle) / 2;
    
    const angleRad = (middleAngle * Math.PI) / 180;
    const distance = 35;
    
    return {
      x: 50 + distance * Math.cos(angleRad),
      y: 50 + distance * Math.sin(angleRad)
    };
  };

  return (
    <div className="relative max-w-4xl mx-auto pt-20 pb-32">
      <div className="relative aspect-square max-w-lg mx-auto">
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] border-8 border-gray-100">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {calculatePaths().map(({ path, group }, index) => (
              <path
                key={group.id}
                d={path}
                className={`${group.color} transition-colors duration-300 ${
                  hoveredGroup === group.id ? 'opacity-100' : 'opacity-90'
                }`}
                onMouseEnter={() => setHoveredGroup(group.id)}
                onMouseLeave={() => setHoveredGroup(null)}
                onClick={() => onSelectGroup(group)}
                style={{ transform: 'rotate(90deg)' }}
              />
            ))}
          </svg>

          {foodGroups.map((group, index) => {
            const position = getLabelPosition(group.percentage, index);
            const isActive = hoveredGroup === group.id;

            return (
              <div
                key={group.id}
                className={`absolute transition-all duration-300 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 ${
                  group.color.replace('bg', 'border').replace('500', '200')
                }`}>
                  <div className={`p-2 rounded-lg ${group.color.replace('500', '100')}`}>
                    {group.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{group.name}</p>
                    <p className={`text-sm ${group.color.replace('bg', 'text')}`}>
                      {group.percentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute inset-[15%] rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-4 border-gray-50 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
                {hoveredGroup 
                  ? foodGroups.find(g => g.id === hoveredGroup)?.icon 
                  : foodGroups[0].icon}
              </div>
              <p className="text-sm font-medium text-gray-600">
                {hoveredGroup 
                  ? foodGroups.find(g => g.id === hoveredGroup)?.name 
                  : 'Método del Plato'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}