import { useNavigate } from 'react-router-dom';
import { Bot, User, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../../types/ai';
import { RecipeMessage } from './RecipeMessage';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const navigate = useNavigate();

  // Si el mensaje contiene una receta, mostrar RecipeMessage
  if (message.recipe) {
    return (
      <RecipeMessage 
        recipe={message.recipe}
        message={message.content}
        favorites={[]}
        onViewRecipe={(recipe) => navigate(`/recipe/${recipe.id}`)}
        onShareRecipe={() => {/* implementar compartir */}}
        onToggleFavorite={() => {/* implementar toggle favorito */}}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-2 ${
        message.role === 'assistant' ? 'justify-start' : 'justify-end'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="relative flex-shrink-0">
          <div className="bg-rose-500/10 backdrop-blur-sm p-2 rounded-lg">
            <Bot size={16} className="text-rose-500" />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-1 -right-1 bg-white rounded-full p-1"
          >
            <Sparkles size={8} className="text-rose-500" />
          </motion.div>
        </div>
      )}

      <div className={`
        group relative max-w-[85%] rounded-2xl px-4 py-2.5 
        ${message.role === 'assistant' 
          ? 'bg-white text-gray-900' 
          : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white ml-auto'
        }
      `}>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="m-0">{children}</p>,
              a: ({ children, href }) => (
                <a 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-700 underline"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 my-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2">
                  {children}
                </pre>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      {message.role === 'user' && (
        <div className="relative flex-shrink-0">
          <div className="bg-rose-500 p-2 rounded-lg">
            <User size={16} className="text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
}