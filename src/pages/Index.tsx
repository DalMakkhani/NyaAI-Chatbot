import { useState } from "react";
import ChatWelcome from "@/components/ChatWelcome";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const handleStartChat = (message: string) => {
    setInitialMessage(message);
    setChatStarted(true);
  };

  return (
    <div className="min-h-screen">
      {!chatStarted ? (
        <ChatWelcome onStartChat={handleStartChat} />
      ) : (
        <ChatInterface initialMessage={initialMessage} />
      )}
    </div>
  );
};

export default Index;
