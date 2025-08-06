import { MessageCircle } from "lucide-react";

interface ChatWelcomeProps {
  onStartChat: (message: string) => void;
}

const ChatWelcome = ({ onStartChat }: ChatWelcomeProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    if (message.trim()) {
      onStartChat(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        {/* Main Title */}
        <div className="float">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
            NyaAI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Your Friendly Legal Assistant
          </p>
        </div>

        {/* Welcome Message */}
        <div className="glass rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-4 text-lg text-foreground/90 leading-relaxed">
            <p className="font-medium text-primary">
              I'm here to help — in simple words and in your language.
            </p>
            <p className="text-muted-foreground">
              Chat with me in English or Hindi. Upload legal documents too!
            </p>
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-2">
            <div className="flex gap-3 items-end">
              <textarea
                name="message"
                placeholder="Ask me anything about law, documents, or your rights…"
                className="flex-1 bg-transparent border-0 px-6 py-4 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-0 resize-none min-h-[56px] max-h-32"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                type="submit"
                className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors flex-shrink-0"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWelcome;