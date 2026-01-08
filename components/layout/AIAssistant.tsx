"use client";

import { Product } from "@/lib/db/products";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AnimatePresence, motion } from "framer-motion";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { formatPrice } from "@/lib/utils";

interface ChatPart {
  type: string;
  text?: string;
  state?: string;
  output?: {
    products?: Product[];
    message?: string;
  };
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const renderers = {
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} className="text-blue-400 underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          {children}
        </a>
      );
    },
  };

  const isLoading = status === "streaming" || status === "submitted";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 150);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed h-screen inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="w-80 sm:w-96 shadow-xl flex flex-col max-h-[600px] h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Shopping Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={scrollRef}
              >
                {messages.length === 0 && (
                  <div className="bg-muted p-3 rounded-lg text-sm max-w-[85%] self-start">
                    Hi! I can help you find products, compare items, or answer
                    your questions. What are you looking for today?
                  </div>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg text-sm max-w-[85%] ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {m.parts.map((_part, idx) => {
                        const part = _part as ChatPart;
                        // 1) Normal assistant / user text
                        if (part.type === "text") {
                          return (
                            <div
                              key={idx}
                              className="prose prose-sm dark:prose-invert"
                            >
                              <ReactMarkdown components={renderers}>
                                {part.text}
                              </ReactMarkdown>
                            </div>
                          );
                        }

                        // 2) Tool results: searchProducts
                        if (part.type === "tool-searchProducts") {
                          const state = part.state;

                          if (
                            state === "input-streaming" ||
                            state === "input-available"
                          ) {
                            return (
                              <div
                                key={idx}
                                className="text-xs italic flex items-center gap-1"
                              >
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Searching...
                              </div>
                            );
                          }

                          if (state === "output-available") {
                            const output = part.output as {
                              products?: Product[];
                              message?: string;
                            };

                            if (
                              !output?.products ||
                              output.products.length === 0
                            ) {
                              return (
                                <div
                                  key={idx}
                                  className="text-xs text-muted-foreground"
                                >
                                  {output?.message ??
                                    "No matching products found."}
                                </div>
                              );
                            }

                            return (
                              <div key={idx} className="space-y-3">
                                {output.products.map((p) => (
                                  <>
                                    <div
                                      key={p.id}
                                      className="rounded-lg bg-background shadow-sm border p-3 flex gap-3"
                                    >
                                      {/* image */}
                                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-black/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={p.image}
                                          alt={p.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>

                                      {/* text */}
                                      <div className="flex flex-col gap-1">
                                        <div className="font-semibold text-sm">
                                          {p.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {formatPrice(p.price)} · ⭐ {p.rating}{" "}
                                          · {p.category}
                                        </div>
                                        <div className="text-xs line-clamp-2">
                                          {p.description}
                                        </div>
                                        <Link
                                          href={`/products/${p.id}`}
                                          onClick={() => setIsOpen(false)}
                                          className="text-xs text-blue-400 underline mt-1"
                                        >
                                          View product →
                                        </Link>
                                      </div>
                                    </div>
                                  </>
                                ))}
                              </div>
                            );
                          }

                          if (state === "output-error") {
                            return (
                              <div key={idx} className="text-xs text-red-400">
                                Something went wrong while searching.
                              </div>
                            );
                          }
                        }

                        return null;
                      })}
                    </div>
                  </div>
                ))}

                {isLoading &&
                  messages[messages.length - 1]?.role === "user" && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg text-sm max-w-[85%] flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                      </div>
                    </div>
                  )}
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form
                  className="flex w-full items-center space-x-2"
                  onSubmit={handleSubmit}
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Ask about products..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
