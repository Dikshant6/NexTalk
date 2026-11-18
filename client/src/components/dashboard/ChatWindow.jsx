import { useEffect, useRef, useState } from "react";
import { Phone, Video, Plus, Smile, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ChatMoreMenu from "./ChatMoreMenu";

export default function ChatWindow({
  chat,
  onToggleDetails,
  onToggleMute,
  onClearChat,
  onDeleteConversation,
}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages(chat?.messages || []);
    setMessage("");
  }, [chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text) return;

    const newMessage = {
      id: crypto.randomUUID(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previous) => [...previous, newMessage]);
    setMessage("");
  };

  if (!chat) {
    return (
      <div className="grid h-full min-h-0 place-items-center rounded-2xl border border-app-border bg-surface">
        <div className="text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-surface-secondary text-primary-hover">
            <ArrowUp size={26} />
          </div>

          <h2 className="text-lg font-semibold text-ink">
            Your conversations, all in one place.
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            Select a conversation to start messaging.
          </p>
        </div>
      </div>
    );
  }

  const headerActions = [
    { Icon: Phone, label: "Voice call" },
    { Icon: Video, label: "Video call" },
  ];

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-surface">
      {/* Header */}
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-app-border px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-secondary text-sm font-semibold text-ink">
            {chat.avatar}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-ink">
              {chat.name}
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              {chat.online ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            {headerActions.map(({ Icon, label }) => (
              <Tooltip key={label}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label={label}
                      className="rounded-lg p-2.5 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
                    />
                  }
                >
                  <Icon size={18} />
                </TooltipTrigger>

                <TooltipContent side="bottom">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>

          <ChatMoreMenu
            chat={chat}
            onContactInfo={onToggleDetails}
            onClearChat={onClearChat}
            onDeleteConversation={onDeleteConversation}
            onToggleMute={onToggleMute}
          />
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-5 text-center">
            <span className="rounded-full bg-surface-secondary px-3 py-1 text-[11px] text-text-secondary">
              Today
            </span>
          </div>

          {messages.map((msg, index) => {
            const mine = msg.sender === "me";

            const previousMessage = messages[index - 1];
            const nextMessage = messages[index + 1];

            const isFirstInGroup =
              !previousMessage || previousMessage.sender !== msg.sender;

            const isLastInGroup =
              !nextMessage || nextMessage.sender !== msg.sender;

            const seenBy = Array.isArray(msg.seenBy) ? msg.seenBy : [];

            return (
              <div
                key={msg.id}
                className={`flex ${
                  mine ? "justify-end" : "justify-start"
                } ${isLastInGroup ? "mb-3" : "mb-1"}`}
              >
                <div className="flex max-w-[80%] flex-col">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 ${
                      mine
                        ? `bg-primary text-[#303329] ${
                            isFirstInGroup ? "rounded-tr-2xl" : "rounded-tr-md"
                          } ${
                            isLastInGroup ? "rounded-br-sm" : "rounded-br-2xl"
                          }`
                        : `border border-app-border bg-surface text-ink ${
                            isFirstInGroup ? "rounded-tl-2xl" : "rounded-tl-md"
                          } ${
                            isLastInGroup ? "rounded-bl-sm" : "rounded-bl-2xl"
                          }`
                    }`}
                  >
                    <p className="break-words text-[13px] leading-[1.55] sm:text-sm">
                      {msg.text}
                    </p>

                    <div
                      className={`mt-1 flex items-center justify-end text-[10px] leading-none ${
                        mine ? "text-[#59664A]" : "text-text-muted"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {/* Reader avatars */}
                  {mine && seenBy.length > 0 && (
                    <div className="mt-1 flex items-center justify-end">
                      <div className="flex -space-x-1.5">
                        {seenBy.slice(0, 3).map((reader, readerIndex) => (
                          <div
                            key={reader.id || readerIndex}
                            title={reader.name || "Seen"}
                            className="grid size-[18px] shrink-0 place-items-center overflow-hidden rounded-full border-2 border-surface bg-surface-secondary text-[8px] font-semibold text-ink"
                          >
                            {reader.avatar &&
                            reader.avatar.startsWith("http") ? (
                              <img
                                src={reader.avatar}
                                alt={reader.name || "Reader"}
                                className="size-full object-cover"
                              />
                            ) : (
                              reader.avatar ||
                              reader.name?.charAt(0)?.toUpperCase() ||
                              "?"
                            )}
                          </div>
                        ))}
                      </div>

                      {seenBy.length > 3 && (
                        <span className="ml-1 text-[9px] text-text-muted">
                          +{seenBy.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {/* Composer */}
      <div className="shrink-0 px-5 pb-5 pt-3">
        <form
          onSubmit={handleSend}
          className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-app-border bg-composer px-3 py-3 shadow-sm transition-all focus-within:border-primary"
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label="Add attachment"
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-secondary text-composer-action transition hover:bg-app-border"
                />
              }
            >
              <Plus size={21} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Add attachment</p>
            </TooltipContent>
          </Tooltip>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend(event);
              }
            }}
            placeholder="Write a message..."
            rows={1}
            className="max-h-32 min-h-10 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-ink outline-none placeholder:text-text-muted"
          />

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label="Emoji"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-text-secondary transition hover:bg-surface-secondary hover:text-ink"
                />
              }
            >
              <Smile size={19} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Emoji</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <button
                type="submit"
                disabled={!message.trim()}
                aria-label="Send message"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-[#303329] shadow-sm transition hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:bg-app-border disabled:text-text-muted disabled:shadow-none"
              >
                <ArrowUp size={20} />
              </button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </form>
      </div>
    </section>
  );
}
