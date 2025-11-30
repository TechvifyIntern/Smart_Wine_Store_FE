'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbotStore } from '@/store/chatbot';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, X, Bot } from 'lucide-react';

export function Chatbot() {
  const { isOpen, toggleChatbot, messages, sendMessage, loading } =
    useChatbotStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[28rem] flex flex-col shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bot />
          AI Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={toggleChatbot}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[85%] ${
                msg.isUser
                  ? 'bg-primary text-primary-foreground self-end'
                  : 'bg-muted self-start'
              }`}
            >
              {msg.message}
            </div>
          ))}
          {loading && (
            <div className="p-2 rounded-lg bg-muted self-start">
              Bot is typing...
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
          placeholder="Ask something..."
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
