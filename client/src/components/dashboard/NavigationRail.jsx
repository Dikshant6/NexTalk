import {
  MessageCircle,
  Phone,
  Settings,
  UserRound,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { label: "Messages", path: "/chats", icon: MessageCircle },
  { label: "Calls", path: "/calls", icon: Phone },
];

export default function NavigationRail({ user, onProfileClick, onLogout }) {
  const navigate = useNavigate();

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

      {/* Profile Menu */}

      <DropdownMenu>
        <DropdownMenuTrigger
          className="grid size-11 shrink-0 place-items-center rounded-full outline-none transition hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Open profile menu"
        >
          <Avatar className="size-10 border-2 border-transparent transition hover:border-primary">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              alt={user?.displayName || "Profile"}
            />

            <AvatarFallback className="bg-surface-secondary text-sm font-semibold text-ink">
              {user?.displayName?.[0]?.toUpperCase() || "N"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="end"
          sideOffset={12}
          className="w-56 rounded-xl border border-app-border bg-surface p-2 shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-2">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.displayName || "NexTalk User"}
              </p>

              <p className="truncate text-xs font-normal text-text-secondary">
                {user?.email || ""}
              </p>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onProfileClick}
            className="cursor-pointer gap-2 rounded-lg px-2 py-2.5 text-ink data-[highlighted]:bg-primary data-[highlighted]:text-ink data-[highlighted]:outline-none"
          >
            <UserRound size={16} />
            Your Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="cursor-pointer gap-2 rounded-lg px-2 py-2.5 text-ink data-[highlighted]:bg-primary data-[highlighted]:text-ink data-[highlighted]:outline-none"
          >
            <Settings size={16} />
            Account Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer gap-2 rounded-lg px-2 py-2.5 text-ink data-[highlighted]:bg-primary data-[highlighted]:text-ink data-[highlighted]:outline-none"
          >
            <LogOut size={16} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
