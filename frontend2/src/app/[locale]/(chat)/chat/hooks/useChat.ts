import { useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'system' | 'assistant' | 'data';
  content: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const append = async (message: Message) => {
    console.log('Starting append function');
    setIsLoading(true);
    try {
      setMessages(prev => [...prev, message]);
      console.log('Sending request to API');

      const response = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.content }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          console.log({ line }, 'Processing line');
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log({ data }, 'Parsed data');
              if (data.type === 'thinking') {
                // Add thinking message to chat
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: data.content,
                }]);

                console.log({ content: data.content }, 'Thinking content');
              } else if (data.type === 'result') {
                // Dispatch custom event for table update
                window.dispatchEvent(new CustomEvent('updateTable', {
                  detail: data.content,
                }));
              }
            } catch (e) {
              console.log({ error: e }, 'Error parsing SSE message');
            }
          }
        }
      }
    } catch (error) {
      console.log({ error }, 'Error in append function');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    append,
  };
};
