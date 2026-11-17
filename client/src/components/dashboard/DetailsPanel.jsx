import {
  Phone,
  Video,
  Image,
  FileText,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function DetailsPanel({ chat }) {
  if (!chat) {
    return (
      <aside className="h-full rounded-2xl border border-app-border bg-surface" />
    );
  }

  const sharedItems = [
    { icon: Image, name: "Media", count: "12 items" },
    { icon: FileText, name: "Documents", count: "4 files" },
    { icon: Link2, name: "Links", count: "3 links" },
  ];

  return (
    <aside className="h-full overflow-y-auto rounded-2xl border border-app-border bg-surface">
      {/* Contact profile */}
      <div className="flex flex-col items-center px-5 py-10">
        <div className="grid size-20 place-items-center rounded-full bg-app-border text-2xl font-semibold text-ink">
          {chat.avatar}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-ink">{chat.name}</h2>

        <p className="mt-1 text-xs text-text-secondary">@{chat.username}</p>

        <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
          <span
            className={`size-2 rounded-full ${
              chat.online ? "bg-olive" : "bg-[#B5B1A7]"
            }`}
          />
          {chat.online ? "Online" : "Offline"}
        </div>

        <div className="mt-6 flex gap-3">
          {[Phone, Video].map((Icon, index) => (
            <button
              key={index}
              type="button"
              title={index === 0 ? "Voice call" : "Video call"}
              className="grid size-10 place-items-center rounded-xl border border-app-border text-olive transition hover:bg-surface-secondary hover:text-ink"
            >
              <Icon size={17} />
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-app-border-strong" />

      {/* Shared content */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Shared content</h3>

          <button
            type="button"
            className="text-xs text-olive transition hover:text-ink"
          >
            View all
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {sharedItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-surface-secondary text-olive">
                  <item.icon size={17} />
                </div>

                <span className="text-sm text-text-secondary">
                  {item.name}
                </span>
              </div>

              <span className="text-xs text-text-muted">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5">
        <Separator className="bg-app-border-strong" />
      </div>

      {/* Privacy */}
      <div className="mx-5 mt-3 flex gap-3 rounded-xl border border-app-border bg-app p-3">
        <ShieldCheck className="shrink-0 text-olive" size={18} />

        <div>
          <p className="text-xs font-medium text-text-secondary">
            Privacy & security
          </p>

          <p className="mt-1 text-[11px] leading-5 text-text-secondary">
            Manage your conversation privacy and settings.
          </p>
        </div>
      </div>
    </aside>
  );
}
