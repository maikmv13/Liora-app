import create from 'zustand';

interface ChatState {
  hasVisited: boolean;
  setHasVisited: () => void;
}

export const useChatState = create<ChatState>((set) => ({
  hasVisited: false,
  setHasVisited: () => set({ hasVisited: true }),
})); 