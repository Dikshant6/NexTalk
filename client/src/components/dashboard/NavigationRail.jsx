import { MessageCircle, Phone, UserRound, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Messages", path: "/chats", icon: MessageCircle },
  { label: "Calls", path: "/calls", icon: Phone },
  { label: "Profile", path: "/profile", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function NavigationRail() {
  return (
    <aside className="flex h-full min-h-0 w-[68px] shrink-0 flex-col items-center rounded-2xl border border-app-border bg-app py-5">
      {/* NexTalk Logo */}
      <div
        title="NexTalk"
        className="grid size-10 shrink-0 place-items-center rounded-xl"
      >
        <span className="text-xl font-bold tracking-tight text-black">N</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center justify-center gap-6">
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) =>
              `grid size-10 place-items-center rounded-xl transition-colors ${
                isActive
                  ? "text-primary-hover"
                  : "text-text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                fill={isActive ? "currentColor" : "none"}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
