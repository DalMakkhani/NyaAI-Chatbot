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
            <p className="font-medium">🤖⚖️ NyaAI – Your Friendly Legal Assistant</p>
            <div className="space-y-2 text-base">
              <p>Lost your wallet and police isn't cooperating?</p>
              <p>Not sure how to respond to a legal notice?</p>
              <p>Need help understanding an affidavit or property paper?</p>
            </div>
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
            <div className="flex gap-3">
              <input
                type="text"
                name="message"
                placeholder="Ask me anything about law, documents, or your rights…"
                className="flex-1 bg-transparent border-0 px-6 py-4 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                autoFocus
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors"
              >
                Ask
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWelcome;