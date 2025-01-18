import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ScreenLayoutProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  children: React.ReactNode;
}

export function ScreenLayout({
  icon: Icon,
  title,
  subtitle,
  description,
  color,
  onNext,
  onPrev,
  isFirst,
  children
}: ScreenLayoutProps) {
  return (
    <div className="h-full flex flex-col px-6 py-12">
      {/* Icon and Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className={`inline-flex p-4 rounded-2xl bg-${color}-50 mb-4`}>
          <Icon size={32} className={`text-${color}-500`} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">{subtitle}</p>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </motion.div>

      {/* Features */}
      <div className="flex-1 space-y-6">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            className={`p-2 rounded-lg ${
              isFirst
                ? 'opacity-0 pointer-events-none'
                : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <button
            onClick={onNext}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}