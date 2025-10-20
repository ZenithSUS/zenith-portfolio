"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FaXmark } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      // Optimistically add an empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                assistantMessage += parsed.content;

                // Update the last message (assistant's response)
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return updated;
                });
              } catch (e) {
                // Skip invalid JSON
                console.error("Could not parse stream data:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isChatOpen) {
    return (
      <motion.div
        className="glow-border bg-foreground/70 fixed right-4 bottom-4 z-40 cursor-pointer rounded-full p-3 shadow-lg backdrop-blur-lg"
        onClick={() => setIsChatOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3 }}
        whileTap={{ scale: 1.05 }}
      >
        <FaRobot className="text-primary" size={30} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glow-border bg-foreground/50 fixed right-0 bottom-0 z-40 m-4 flex max-h-[60vh] w-full max-w-4xl flex-col rounded-lg p-4 shadow-lg backdrop-blur-lg md:w-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1.05 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Close Button */}
      <div className="absolute top-2 right-2">
        <button onClick={() => setIsChatOpen(false)}>
          <FaXmark className="text-primary hover:text-red-500" size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Zenith AI</h1>
        <p className="text-primary font-semibold">
          Ask me anything about the portfolio!
        </p>
      </div>

      {/* Messages Container */}
      <div className="bg-background mb-4 flex-1 space-y-4 overflow-y-auto rounded-lg p-4">
        {messages.length === 0 && (
          <div className="text-subtext mt-10 text-center">
            <p className="text-lg">👋 Hello! How can I help you today?</p>
            <p className="mt-2 text-sm">
              Try asking about projects, skills, or experience.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === "user"
                  ? "bg-primary border border-gray-200 text-black"
                  : "bg-accent text-text border border-gray-200"
              }`}
            >
              <div className="mb-1 text-sm font-semibold">
                {msg.role === "user" ? "You" : "Assistant"}
              </div>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
                <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]"></div>
                <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the portfolio..."
          className="flex-1 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isLoading}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary rounded-lg px-6 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? "Sending..." : "Send"}
        </motion.button>
      </form>
    </motion.div>
  );
}
