import React from 'react';

export function ShoppingListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Progress bar skeleton */}
      <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-rose-100">
        <div className="h-2 bg-gray-200 rounded-full w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded-full w-24" />
      </div>

      {/* Categories skeleton */}
      {[1, 2, 3, 4].map((_, index) => (
        <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100 overflow-hidden">
          {/* Category header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="h-5 bg-gray-200 rounded-full w-32" />
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
          </div>

          {/* Category items */}
          <div className="border-t border-rose-100">
            {[1, 2, 3].map((_, itemIndex) => (
              <div 
                key={itemIndex}
                className="p-4 flex items-center justify-between border-b border-rose-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-40" />
                    <div className="h-3 bg-gray-200 rounded-full w-24" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 