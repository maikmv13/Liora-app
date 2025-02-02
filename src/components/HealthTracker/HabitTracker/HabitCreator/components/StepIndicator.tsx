import React from 'react';
import { motion } from 'framer-motion';
import { StepIndicatorProps } from '../types';

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
        <div
          key={stepNumber}
          className={`flex items-center ${stepNumber !== totalSteps && 'flex-1'}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: stepNumber === currentStep ? 1 : 0.8,
              opacity: 1 
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stepNumber === currentStep
                ? 'bg-white text-violet-600 shadow-lg'
                : stepNumber < currentStep
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-white/60'
            }`}
          >
            {stepNumber < currentStep ? '✓' : stepNumber}
          </motion.div>
          {stepNumber !== totalSteps && (
            <div className={`h-0.5 flex-1 mx-2 rounded ${
              stepNumber < currentStep
                ? 'bg-white/20'
                : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}