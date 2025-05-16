'use client';

import { Sender } from '@ant-design/x';
import { useState } from 'react';

type Message = {
  content: string;
  type: 'user' | 'assistant';
};

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    if (!content.trim()) {
      return;
    }

    const userMessage = content.trim();
    setMessages(prev => [...prev, { content: userMessage, type: 'user' }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Test message' }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4">

      </div>
      <div className="p-4 border-t">
        <Sender
          onSubmit={handleSend}
          loading={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
