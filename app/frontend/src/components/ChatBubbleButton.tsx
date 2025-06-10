import { Bot } from 'lucide-react'; // or use any robot icon you like

import React from 'react';

type ChatBubbleButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ChatBubbleButton: React.FC<ChatBubbleButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-4 right-4 p-4 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
  >
    <Bot className="text-white" size={28} />
  </button>
);

export default ChatBubbleButton;
