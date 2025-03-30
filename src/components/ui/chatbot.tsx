'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useStore } from "@/store/useStore";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // You can implement your chat logic here
    // This is just a placeholder response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm a placeholder response. Replace this with your actual chat logic!",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-[700px] w-full max-w-2xl flex-col rounded-lg border bg-card shadow-lg">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Bot className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Chat with uploaded file</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex w-max max-w-[80%] flex-col gap-1 rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <div className="flex items-center gap-2">
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-50">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-pulse">●</div>
              <div className="animate-pulse animation-delay-200">●</div>
              <div className="animate-pulse animation-delay-400">●</div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t p-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}