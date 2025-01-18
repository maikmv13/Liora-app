import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { DesktopChat } from './components/DesktopChat';
import { MobileChat } from './components/MobileChat';

export function LioraChat() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <MobileChat /> : <DesktopChat />;
}

export default LioraChat;