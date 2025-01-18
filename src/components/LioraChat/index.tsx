import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { DesktopChat } from './components/DesktopChat';
import { MobileChat } from './components/MobileChat';

interface LioraChatProps {
  initialQuery?: string;
  onQuerySelect?: (query: string) => void;
}

export function LioraChat({ initialQuery = '', onQuerySelect }: LioraChatProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [input, setInput] = useState(initialQuery);

  // Update input when initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  const handleQuerySelect = (query: string) => {
    setInput(query);
    onQuerySelect?.(query);
  };

  return isMobile ? (
    <MobileChat 
      initialInput={input} 
      onQuerySelect={handleQuerySelect}
    />
  ) : (
    <DesktopChat 
      initialInput={input}
      onQuerySelect={handleQuerySelect}
    />
  );
}

export default LioraChat;