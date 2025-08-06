import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Trash2, Globe } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ThemeToggle from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessage: string;
}

const ChatInterface = ({ initialMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const sendToGroq = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const systemPrompt = `You are a knowledgeable legal assistant specializing in Indian laws. You help users understand legal situations and provide practical guidance in a conversational manner.

Your guidelines:
1. Identify the legal issue clearly
2. Provide step-by-step practical advice in simple language (avoid complex legal jargon)
3. For serious or complex matters, always recommend: "You should consult a qualified lawyer for detailed advice"
4. Keep responses helpful, concise, and friendly
5. Support both English and Hindi queries - respond in the same language the user uses
6. Remember the conversation context and refer back to previous questions when relevant
7. If asked about laws outside India, politely redirect to Indian legal context
8. Always clarify that this is general guidance, not formal legal advice

Maintain a helpful, professional, and conversational tone throughout the chat.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from NyaAI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  };

  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendToGroq(messageText, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTypingMessageId(assistantMessage.id);
      
      // Remove typing effect after message is fully typed
      setTimeout(() => {
        setTypingMessageId(null);
      }, response.length * 20 + 500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from NyaAI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];

      if (allowedTypes.includes(file.type)) {
        toast({
          title: "Document uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        // Here you would typically process the file
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOCX, PNG, or JPG files only.",
          variant: "destructive",
        });
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTypingMessageId(null);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been cleared.",
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
    toast({
      title: "Language changed",
      description: `Switched to ${language === 'english' ? 'Hindi' : 'English'}`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header - Fixed */}
      <header className="glass border-b border-border/50 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">NyaAI</h1>
            <p className="text-sm text-muted-foreground">Legal Assistant</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <button
              onClick={toggleLanguage}
              className="glass-hover px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Globe className="h-4 w-4" />
              {language === 'english' ? 'EN' : 'हि'}
            </button>
            
            <button
              onClick={clearChat}
              className="glass-hover px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </header>

      {/* Messages - Scrollable */}
      <main className="flex-1 overflow-y-auto chat-scroll p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isTyping={typingMessageId === message.id}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="chat-bubble-bot p-4 rounded-2xl rounded-bl-md">
                <div className="text-muted-foreground">Thinking...</div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input - Fixed */}
      <footer className="glass border-t border-border/50 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="glass-hover p-3 rounded-xl"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="flex-1 glass rounded-xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={messages.length === 0 ? (language === 'english' 
                  ? "Ask about Indian law, documents, or your rights..." 
                  : "भारतीय कानून, दस्तावेज़ या अपने अधिकारों के बारे में पूछें..."
                ) : (language === 'english' ? "Type your message..." : "अपना संदेश लिखें...")}
                className="w-full bg-transparent border-0 px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;