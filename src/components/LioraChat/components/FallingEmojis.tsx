import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_EMOJIS = [
  '🥗', '🥑', '🍕', '🥐', '🥨', '🥯', '🥖', '🫓', 
  '🥪', '🌮', '🌯', '🥙', '🧆', '🥘', '🍜', '🍝',
  '🍱', '🥟', '🍣', '🍙', '🍘', '🍡', '🍧', '🍨',
  '🧁', '🍰', '🎂', '🍮', '🍪', '🍩', '🍫', '🍬'
];

interface FallingEmoji {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  rotationDuration: number;
}

export function FallingEmojis() {
  const [emojis, setEmojis] = useState<FallingEmoji[]>([]);

  useEffect(() => {
    const newEmojis = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
      x: (100 / 6) * (i + 1),
      delay: i * 0.5,
      duration: 5 + Math.random() * 2,
      rotation: -360 + Math.random() * 720,
      rotationDuration: 8 + Math.random() * 4
    }));

    setEmojis(newEmojis);

    const timer = setTimeout(() => {
      setEmojis([]);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            initial={{ 
              y: -50,
              x: `${emoji.x}vw`,
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              y: '110vh',
              rotate: emoji.rotation
            }}
            exit={{ opacity: 0 }}
            transition={{
              y: {
                type: 'easeInOut',
                duration: emoji.duration,
                delay: emoji.delay,
              },
              rotate: {
                duration: emoji.rotationDuration,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
            className="absolute text-4xl"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              willChange: 'transform'
            }}
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 