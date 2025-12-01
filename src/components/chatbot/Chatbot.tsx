"use client";

import { useState, useRef, useEffect } from "react";
import { useChatbotStore } from "@/store/chatbot";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, Bot, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export function Chatbot() {
  const { isOpen, toggleChatbot, messages, sendMessage, loading } =
    useChatbotStore();
  const [input, setInput] = useState("");
  const [hasNewResponse, setHasNewResponse] = useState(false); // State để theo dõi tin nhắn mới khi đóng
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  // 1. Auto scroll xuống cuối khi có tin nhắn mới hoặc đang loading
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewResponse(false); // Reset thông báo khi mở chat
    }
  }, [messages, loading, isOpen]);

  // Logic: Nếu đang đóng mà loading kết thúc (có tin nhắn về), bật thông báo
  useEffect(() => {
    if (!isOpen && !loading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        setHasNewResponse(true);
      }
    }
  }, [loading, isOpen, messages]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput("");
    }
  };

  // Nút mở Chatbot (Khi đang đóng)
  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4">
        {/* Chấm đỏ thông báo nếu có tin nhắn mới */}
        {hasNewResponse && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}

        <Button
          onClick={toggleChatbot}
          className={`h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 
            ${loading ? "animate-pulse ring-4 ring-primary/30" : ""} 
            ${hasNewResponse ? "animate-bounce" : ""}`} // Hiệu ứng nhảy nếu có tin mới
          size="icon"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin" /> // Spin loading ngay trên nút icon
          ) : (
            <MessageSquare className="h-8 w-8" />
          )}
        </Button>
      </div>
    );
  }

  // Giao diện Chatbot (Khi mở)
  return (
    <Card className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50 gap-0 p-0">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-primary/5">
        <CardTitle className="flex items-center text-primary">
          <div className="p-2 bg-primary rounded-full text-primary-foreground">
            <Bot size={20} />
          </div>
          <span className="text-lg font-bold">{t("Chatbot.aiAssistant")}</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChatbot}
          className="hover:bg-destructive/10 hover:text-destructive rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      {/* Content Area - Fix Scroll Here */}
      <CardContent className="flex-1 overflow-hidden p-0 relative bg-background">
        <div className="h-full overflow-y-auto overscroll-contain p-4 flex flex-col gap-4 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.isUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none border"
                }`}
              >
                {typeof msg.message === "string"
                  ? msg.message
                  : msg.message.params
                    ? t(msg.message.key)
                    : t(msg.message.key)}
              </div>
            </div>
          ))}

          {/* Loading Effect (Typing Indicator) */}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="bg-muted p-3 rounded-2xl rounded-bl-none border flex items-center gap-2">
                <Bot size={16} className="text-muted-foreground" />
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}

          {/* Ref nằm bên trong container scrollable */}
          <div ref={messagesEndRef} className="pt-2" />
        </div>
      </CardContent>

      {/* Footer / Input Area */}
      <CardFooter className="p-3 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full gap-2 items-center"
        >
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 focus-visible:ring-primary"
            placeholder={t("Chatbot.placeholder")}
            disabled={loading}
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="icon"
            className={`transition-all ${input.trim() ? "bg-primary" : "bg-muted-foreground"}`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
