import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  UserRound,
  Search,
  Bell,
  BellOff,
  Eraser,
  Trash2,
} from "lucide-react";

export default function ChatMoreMenu({
  chat,
  onContactInfo,
  onClearChat,
  onDeleteConversation,
  onToggleMute,
}) {
  const muted = Boolean(chat?.isMuted);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [chat?.id]);

  const handleToggleMute = () => {
    onToggleMute?.(chat.id, !muted);
    setOpen(false);
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleClearChat = () => {
    if (!chat?.messages?.length) return;

    const confirmed = window.confirm(
      `Clear all messages with ${chat.name}? This cannot be undone.`,
    );

    if (confirmed) {
      onClearChat?.(chat.id);
      setOpen(false);
    }
  };

  const handleDeleteConversation = () => {
    const confirmed = window.confirm(
      `Delete your conversation with ${chat.name}? This cannot be undone.`,
    );

    if (confirmed) {
      onDeleteConversation?.(chat.id);
      setOpen(false);
    }
  };

  const menuItems = [
    {
      label: "Contact info",
      Icon: UserRound,
      onClick: () => {
        onContactInfo?.();
        setOpen(false);
      },
    },
    {
      label: "Search messages",
      Icon: Search,
      onClick: () => {
        setOpen(false);
        // Message search will be implemented separately.
      },
      disabled: true,
    },
    {
      label: muted ? "Unmute notifications" : "Mute notifications",
      Icon: muted ? Bell : BellOff,
      onClick: handleToggleMute,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`rounded-lg p-2.5 transition-colors ${
          open
            ? "bg-surface-secondary text-primary-hover"
            : "text-text-secondary hover:bg-surface-secondary hover:text-ink"
        }`}
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-app-border bg-surface p-1.5 shadow-lg"
        >
          {menuItems.map(({ label, Icon, onClick, disabled }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              disabled={disabled}
              onClick={onClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-main transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon size={16} className="text-text-secondary" />
              {label}
              {disabled && (
                <span className="ml-auto text-[10px] text-text-muted">
                  Soon
                </span>
              )}
            </button>
          ))}

          <div className="my-1.5 border-t border-app-border" />

          <button
            type="button"
            role="menuitem"
            disabled={!chat?.messages?.length}
            onClick={handleClearChat}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-secondary transition hover:bg-surface-secondary hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eraser size={16} />
            Clear chat
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleDeleteConversation}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#D65B52] transition hover:bg-[#D65B52]/10"
          >
            <Trash2 size={16} />
            Delete conversation
          </button>
        </div>
      )}
    </div>
  );
}
