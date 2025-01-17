import React from 'react';
import { weekDays } from './utils';

export function MenuSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Today's Menu Skeleton */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
        <div className="p-4 border-b border-rose-100/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-100 rounded-lg"></div>
            <div>
              <div className="h-5 w-32 bg-rose-100 rounded"></div>
              <div className="h-4 w-24 bg-rose-100/50 rounded mt-2"></div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-rose-100/10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-lg"></div>
                  <div>
                    <div className="h-4 w-24 bg-rose-100 rounded"></div>
                    <div className="h-3 w-16 bg-rose-100/50 rounded mt-2"></div>
                  </div>
                </div>
                <div className="h-8 w-24 bg-rose-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Menu Skeleton */}
      <div className="hidden md:grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden"
          >
            <div className="p-4 border-b border-rose-100/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-rose-100 rounded-lg"></div>
                <div className="h-4 w-16 bg-rose-100 rounded"></div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-rose-100/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Menu Skeleton */}
      <div className="md:hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
          <div className="p-4 border-b border-rose-100/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg"></div>
                <div>
                  <div className="h-5 w-32 bg-rose-100 rounded"></div>
                  <div className="h-4 w-24 bg-rose-100/50 rounded mt-2"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-rose-100/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}