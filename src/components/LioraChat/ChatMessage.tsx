import { RecipeMessage } from './components/RecipeMessage';
import type { ChatMessage } from '../../hooks/useAI';

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.type === 'card' && message.recipes?.[0]) {
    console.log('Renderizando RecipeMessage:', message.recipes[0]);
    return (
      <RecipeMessage
        recipe={message.recipes[0]}
        message={message.content}
        onViewRecipe={() => message.onView?.()}
        onShareRecipe={() => message.onShare?.()}
      />
    );
  }

  return (
    <div className={`message ${message.role}`}>
      {message.content}
    </div>
  );
}