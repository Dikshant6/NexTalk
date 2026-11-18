import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, MessageSquarePlus, Settings, BellOff } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ChatListSkeleton from "./ChatListSkeleton";
import NewConversationDialog from "./NewConversationDialog";

export default function Sidebar({
  chats,
  selectedChat,
  onSelectChat,
  onCreateConversation,
  user,
  isLoading = false,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openNewChat, setOpenNewChat] = useState(false);

  const navigate = useNavigate();

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && chat.unread > 0) ||
      (filter === "groups" && chat.type === "group");

    return matchesSearch && matchesFilter;
  });

  const handleSelectUser = (selectedUser) => {
    onCreateConversation(selectedUser);

    if (existingChat) {
      onSelectChat(existingChat);
      return;
    }

    const newChat = {
      id: selectedUser.id,
      name: selectedUser.name,
      username: selectedUser.username,
      avatar: selectedUser.avatar,
      online: selectedUser.online,
      type: "direct",
      unread: 0,
      time: "",
      lastMessage: "Start a conversation",
      messages: [],
    };

    onSelectChat(newChat);
  };

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-surface">
      {/* Heading */}
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Messages
        </h1>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setOpenNewChat(true)}
                aria-label="New conversation"
                className="rounded-lg p-2 text-primary-hover transition hover:bg-surface-secondary"
              />
            }
          >
            <MessageSquarePlus size={19} />
          </TooltipTrigger>

          <TooltipContent>
            <p>New conversation</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* New Conversation Modal */}
      <NewConversationDialog
        open={openNewChat}
        onOpenChange={setOpenNewChat}
        onSelectUser={handleSelectUser}
      />

      {/* Search */}
      <div className="px-4">
        <div className="flex items-center gap-2 rounded-xl border border-app-border bg-app px-3 transition focus-within:border-primary">
          <Search size={16} className="text-text-secondary" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            aria-label="Search conversations"
            className="h-10 w-full bg-transparent text-sm text-ink outline-none placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="px-4 py-4">
        <TabsList className="h-auto gap-2 bg-transparent p-0">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "groups", label: "Groups" },
          ].map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-secondary shadow-none transition hover:bg-app-border data-[state=active]:bg-primary data-[state=active]:text-ink"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Conversations */}

      <ScrollArea className="min-h-0 flex-1 px-3">
        <div className="pb-3">
          {isLoading ? (
            <ChatListSkeleton />
          ) : (
            <>
              {filteredChats.map((chat) => {
                const active = selectedChat?.id === chat.id;

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => onSelectChat(chat)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      active ? "bg-surface-secondary" : "hover:bg-app"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="size-11">
                        <AvatarFallback className="bg-surface-secondary text-sm font-semibold text-ink">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>

                      {chat.online && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-primary" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Chat name + mute icon + time */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span
                            className={`truncate text-sm font-medium ${
                              active ? "text-ink" : "text-text-secondary"
                            }`}
                          >
                            {chat.name}
                          </span>

                          {chat.isMuted && (
                            <BellOff
                              size={13}
                              strokeWidth={1.8}
                              className="shrink-0 text-text-muted"
                              aria-label="Muted conversation"
                            />
                          )}
                        </div>

                        <span className="shrink-0 text-[10px] text-text-muted">
                          {chat.time}
                        </span>
                      </div>

                      {/* Last message + unread count */}
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-text-secondary">
                          {chat.lastMessage}
                        </span>

                        {chat.unread > 0 && (
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-medium text-white">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredChats.length === 0 && (
                <p className="px-3 py-8 text-center text-xs text-text-secondary">
                  No conversations found.
                </p>
              )}
            </>
          )}
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {/* Profile */}
      <div className="flex h-[76px] shrink-0 items-center justify-between border-t border-app-border px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-11 shrink-0 rounded-full">
            <AvatarFallback className="bg-surface-secondary text-sm font-semibold text-ink">
              {user?.displayName?.[0]?.toUpperCase() || "N"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-ink">
              {user?.displayName || user?.username || "NexTalk User"}
            </h2>

            <p className="truncate text-xs text-text-secondary">
              {user?.email || "Your account"}
            </p>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => navigate("/settings")}
                aria-label="Settings"
                className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-secondary hover:text-ink"
              />
            }
          >
            <Settings size={17} />
          </TooltipTrigger>

          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
