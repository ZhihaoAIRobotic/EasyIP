'use client';

import type { BubbleProps } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import markdownit from 'markdown-it';
import React, { useEffect, useRef } from 'react';
import { DEFAULT_USER_NAME } from '../constants';
import { useChat } from '../hooks/useChat';
import { ChatSender } from './ChatSender';
import { EmptyChat } from './EmptyChat';

/**
 * markdown 渲染
 */
const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = content => (
  <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
);

export const FeynmanChat: React.FC = () => {
  const { append, messages, input, setInput, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取用户名最后一个字符，如果没有用户名则使用默认值
  const userInitial = DEFAULT_USER_NAME;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = () => {
    append({
      id: Date.now().toString(),
      role: 'user',
      content: input,
    });
    setInput('');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat history */}
      <div className="absolute inset-0 bottom-[120px] overflow-y-auto scrollbar-none">
        {messages.filter(item => item.role !== 'system').length === 0
          ? (
              <div className="h-full">
                <EmptyChat />
              </div>
            )
          : (
              <div className="space-y-4 p-4">
                {messages
                  .filter(item => item.role !== 'system')
                  .map(m => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <Bubble
                        content={m.content.trim()}
                        messageRender={renderMarkdown}
                        placement={m.role === 'user' ? 'end' : 'start'}
                        avatar={
                          m.role === 'user'
                            ? (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    {userInitial}
                                  </span>
                                </div>
                              )
                            : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    AI
                                  </span>
                                </div>
                              )
                        }
                      />
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
            )}
      </div>
      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 space-y-2">
        {/* <QuestionInput onAskQuestion={handleFeynmanChat} loading={isLoading} /> */}
        {/* User Input Area */}
        <ChatSender
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          loading={isLoading}
          placeholder="Ask your question..."
        />
      </div>
    </div>
  );
};
