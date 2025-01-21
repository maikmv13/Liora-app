import React from 'react';
import { StepIndicatorProps } from '../types';

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
        <div
          key={stepNumber}
          className={`flex items-center ${stepNumber !== totalSteps && 'flex-1'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            stepNumber === currentStep
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
              : stepNumber < currentStep
              ? 'bg-amber-100 text-amber-500'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {stepNumber < currentStep ? '✓' : stepNumber}
          </div>
          {stepNumber !== totalSteps && (
            <div className={`h-1 flex-1 mx-2 rounded ${
              stepNumber < currentStep
                ? 'bg-amber-100'
                : 'bg-gray-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}