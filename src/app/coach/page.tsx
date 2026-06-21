"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, LoaderCircle, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
}

interface GeminiHistoryItem {
  role: "user" | "model";
  content: string;
}

const STARTER_PROMPTS = [
  "How can I reduce my commute emissions?",
  "What's my best low-carbon meal option?",
  "Analyze my travel habits this week",
] as const;

const assistantIntro =
  "I can help you cut emissions with practical travel, diet, and daily habit advice.";

/**
 * Conversational sustainability coach backed by the Gemini API.
 */
export default function CoachPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [retryMessage, setRetryMessage] = React.useState<string | null>(null);
  const [retryHistory, setRetryHistory] = React.useState<GeminiHistoryItem[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isSending, messages]);

  const submitMessage = async (message: string, historyOverride?: GeminiHistoryItem[]) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
    };

    const nextMessages = [...messages, nextUserMessage];
    const history = historyOverride ?? buildHistory(messages);

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setErrorMessage(null);
    setRetryMessage(trimmedMessage);
    setRetryHistory(history);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "The coach is taking a short break.");
      }

      const payload = (await response.json()) as { response?: string };
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          payload.response?.trim() ||
          "I could not generate a response just now. Try again in a moment.",
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The coach could not respond just now. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const retryLastMessage = () => {
    if (!retryMessage) {
      return;
    }

    void submitMessage(retryMessage, retryHistory);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <section className="mb-5 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          AI Sustainability Coach
        </p>
        <h1 className="text-[32px] font-bold leading-tight text-text-primary">
          Ask Disha anything about lower-carbon choices.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-text-secondary">
          Get concise guidance on travel, food, and daily habits without the lecture.
        </p>
      </section>

      <section className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-40">
          {messages.length === 0 ? (
            <EmptyState onPromptSelect={submitMessage} />
          ) : null}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" ? (
                  <Card className="max-w-[85%] border-l-2 border-l-accent p-4 sm:max-w-[72%]">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
                        <Image src="/disha-logo.svg" alt="Disha avatar" width={20} height={20} />
                      </div>
                      <p className="text-sm font-semibold text-text-primary">Disha</p>
                    </div>
                    <p className="text-sm leading-6 text-text-primary">
                      {message.content}
                    </p>
                  </Card>
                ) : (
                  <div className="max-w-[85%] rounded-2xl bg-accent px-4 py-3 text-sm leading-6 text-background sm:max-w-[72%]">
                    {message.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isSending ? (
              <motion.div
                key="typing"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <Card className="max-w-[85%] border-l-2 border-l-accent p-4 sm:max-w-[72%]">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
                      <Image src="/disha-logo.svg" alt="Disha avatar" width={20} height={20} />
                    </div>
                    <p className="text-sm font-semibold text-text-primary">Disha</p>
                  </div>
                  <TypingIndicator />
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {errorMessage ? (
          <Card className="mb-4 border-amber-400/20 bg-amber-400/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-primary">Response unavailable</p>
                <p className="text-sm leading-6 text-text-secondary">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={retryLastMessage}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                Retry
                <ArrowRight size={16} />
              </button>
            </div>
          </Card>
        ) : null}

        <div className="sticky bottom-4 z-30">
          <Card className="border-accent/20 bg-[linear-gradient(180deg,rgba(17,25,20,0.92),rgba(10,13,10,0.98))] p-4">
            <form
              className="flex items-end gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void submitMessage(input);
              }}
            >
              <textarea
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Disha about commute, meals, or habits..."
                className="min-h-[52px] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted focus:border-accent/40"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-background transition hover:bg-accentDim disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
                Send
              </button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}

/**
 * Builds Gemini-compatible history entries from chat state.
 */
function buildHistory(messages: ChatMessage[]): GeminiHistoryItem[] {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    content: message.content,
  }));
}

/**
 * Empty-state prompt cards shown before the first message.
 */
function EmptyState({
  onPromptSelect,
}: {
  onPromptSelect: (message: string) => void;
}) {
  return (
    <Card glow className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
          <Bot className="text-accent" size={20} />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-text-primary">Start a conversation</p>
          <p className="text-sm leading-6 text-text-secondary">{assistantIntro}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptSelect(prompt)}
            className="rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-left text-sm text-text-primary transition hover:border-accent/40 hover:bg-accent/15"
          >
            {prompt}
          </button>
        ))}
      </div>
    </Card>
  );
}

/**
 * Typing indicator used while the Gemini response is pending.
 */
function TypingIndicator() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="size-2 rounded-full bg-accent"
          animate={
            prefersReducedMotion
              ? { opacity: 0.7 }
              : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.2 }
              : { duration: 0.9, repeat: Infinity, delay: index * 0.12 }
          }
        />
      ))}
    </div>
  );
}
