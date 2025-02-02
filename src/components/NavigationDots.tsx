import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationDotsProps {
  sections: Array<{
    id: string;
    label: string;
    gradient: string;
  }>;
}

export function NavigationDots({ sections }: NavigationDotsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = location.hash.slice(1) || sections[0].id;

  // Add scroll to top effect when hash changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.hash]);

  return (
    <div className="fixed bottom-[2.5rem] left-1/2 -translate-x-1/2 z-40 md:bottom-8">
      <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/20">
        <div className="flex items-center space-x-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(`#${section.id}`)}
              className="group relative p-1.5"
            >
              {/* Dot */}
              <motion.div
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSection === section.id
                    ? `bg-gradient-to-r ${section.gradient}`
                    : 'bg-gray-300 group-hover:bg-gray-400'
                }`}
                animate={{
                  scale: currentSection === section.id ? 1.2 : 1
                }}
              />

              {/* Label tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                  {section.label}
                </div>
              </div>

              {/* Active indicator */}
              {currentSection === section.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}