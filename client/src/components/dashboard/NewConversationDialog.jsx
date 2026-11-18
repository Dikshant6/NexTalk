import { useState } from "react";
import { Search, MessageCircle, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockUsers = [
  {
    id: "user-1",
    name: "Emma Watson",
    username: "emmawatson",
    avatar: "EW",
    online: false,
  },
  {
    id: "user-2",
    name: "Alex Morgan",
    username: "alexmorgan",
    avatar: "AM",
    online: true,
  },
  {
    id: "user-3",
    name: "John Smith",
    username: "johnsmith",
    avatar: "JS",
    online: true,
  },
];

export default function NewConversationDialog({
  open,
  onOpenChange,
  onSelectUser,
}) {
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    );
  });

  const handleSelectUser = (user) => {
    setSearch("");
    onOpenChange(false);
    onSelectUser(user);
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) setSearch("");
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 border-app-border bg-surface text-ink sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            New conversation
          </DialogTitle>

          <DialogDescription className="text-sm text-text-secondary">
            Find someone and start a conversation.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-app-border bg-app px-3 transition focus-within:border-primary">
          <Search size={16} className="shrink-0 text-text-secondary" />

          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or username..."
            aria-label="Search users"
            className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-text-muted"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="text-text-muted transition hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* User list */}
        <div className="space-y-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            {search ? "Search results" : "Suggested people"}
          </p>

          <div className="max-h-72 space-y-1 overflow-y-auto dashboard-scrollbar">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectUser(user)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-surface-secondary"
              >
                <div className="relative shrink-0">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-surface-secondary text-sm font-semibold text-ink">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>

                  {user.online && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {user.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-text-secondary">
                    {user.username}
                  </p>
                </div>

                <MessageCircle
                  size={17}
                  className="shrink-0 text-primary-hover"
                />
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <div className="py-10 text-center">
                <Search size={22} className="mx-auto mb-2 text-text-muted" />

                <p className="text-sm font-medium text-ink">No users found</p>

                <p className="mt-1 text-xs text-text-secondary">
                  Try searching with another name.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
