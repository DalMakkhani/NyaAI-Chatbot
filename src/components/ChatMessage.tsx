import { useState, useEffect } from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
  isTyping?: boolean;
}

const ChatMessage = ({ message, isTyping = false }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (message.role === 'assistant' && isTyping) {
      setDisplayedContent('');
      setShowCursor(true);
      let i = 0;
      const text = message.content;
      
      const typeTimer = setInterval(() => {
        if (i < text.length) {
          setDisplayedContent(text.slice(0, i + 1));
          i++;
        } else {
          setShowCursor(false);
          clearInterval(typeTimer);
        }
      }, 20);

      return () => clearInterval(typeTimer);
    } else {
      setDisplayedContent(message.content);
      setShowCursor(false);
    }
  }, [message.content, message.role, isTyping]);

  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary' : 'glass'
      }`}>
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          isUser 
            ? 'chat-bubble-user rounded-br-md' 
            : 'chat-bubble-bot rounded-bl-md'
        }`}>
          <div className="leading-relaxed">
            {message.role === 'assistant' ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
                <ReactMarkdown 
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                  }}
                >
                  {displayedContent}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{displayedContent}</div>
            )}
            {showCursor && <span className="typewriter">|</span>}
          </div>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-2 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;