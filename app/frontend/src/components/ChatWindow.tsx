import React, { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatWindowProps {
  onClose: () => void;
  report?: any; // Add report prop
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, report }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Retrieve messages from localStorage on initial load
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    // Scroll to the bottom when a new message is added
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Show thinking dots
    setIsThinking(true);

    // Send the message to the backend
    try {
      const response = await fetch("https://ortho-vision-backend.fly.dev//chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages, // Include chat history
          report, // Include report data
        }),
      });
      const data = await response.json();

      // Add the AI's response to the chat
      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      // Hide thinking dots
      setIsThinking(false);
    }

    // Clear the input field
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-6 w-[20%] max-w-sm bg-white shadow-lg rounded-lg flex flex-col" style={{ height: "60vh", maxHeight: "60vh" }}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Chatbot</h3>
        <button onClick={onClose}>
          <X className="text-white" size={20} />
        </button>
      </div>

      {/* Messages */}
      <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "50vh" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[90%] ${
              msg.sender === "user"
                ? "bg-blue-100 text-right ml-auto"
                : "bg-gray-100 text-left mr-auto"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {isThinking && (
          <div className="p-2 rounded-lg max-w-[90%] bg-gray-100 text-left mr-auto">
            <span className="animate-pulse">Thinking ...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center p-2 border-t">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
          onClick={handleSendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;