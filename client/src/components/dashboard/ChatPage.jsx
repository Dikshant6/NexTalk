import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { mockChats } from "@/data/mockChats";
import NavigationRail from "@/components/dashboard/NavigationRail";
import Sidebar from "@/components/dashboard/Sidebar";
import ChatWindow from "@/components/dashboard/ChatWindow";
import DetailsPanel from "@/components/dashboard/DetailsPanel";

export default function ChatPage() {
  const [chats, setChats] = useState(mockChats);
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [showDetails, setShowDetails] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSelectChat = (chat) => {
    setSelectedChatId(chat.id);

    setChats((previous) =>
      previous.map((item) =>
        item.id === chat.id ? { ...item, unread: 0 } : item,
      ),
    );
  };

  const handleToggleMute = (chatId, muted) => {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === chatId ? { ...chat, isMuted: muted } : chat,
      ),
    );
  };

  const handleCreateConversation = (selectedUser) => {
    const existingChat = chats.find(
      (chat) =>
        chat.username === selectedUser.username && chat.type !== "group",
    );

    if (existingChat) {
      handleSelectChat(existingChat);
      return;
    }

    const newChat = {
      id: crypto.randomUUID(),
      userId: selectedUser.id,
      name: selectedUser.name,
      username: selectedUser.username,
      avatar: selectedUser.avatar,
      online: selectedUser.online,
      type: "personal",
      unread: 0,
      lastMessage: "",
      time: "",
      messages: [],
    };

    setChats((previous) => [newChat, ...previous]);
    setSelectedChatId(newChat.id);
  };

  const handleClearChat = (chatId) => {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [],
              lastMessage: "",
              time: "",
              unread: 0,
            }
          : chat,
      ),
    );
  };

  const handleDeleteConversation = (chatId) => {
    const remainingChats = chats.filter((chat) => chat.id !== chatId);

    setChats(remainingChats);

    if (selectedChatId === chatId) {
      setSelectedChatId(remainingChats[0]?.id ?? null);
    }

    setShowDetails(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleToggleDetails = () => {
    setShowDetails((previous) => !previous);
  };

  return (
    <main className="h-dvh min-h-[600px] bg-app p-4 text-text-main">
      <div
        className={`grid h-full min-h-0 gap-3 ${
          showDetails
            ? "grid-cols-[68px_260px_minmax(0,1fr)_280px]"
            : "grid-cols-[68px_260px_minmax(0,1fr)]"
        }`}
      >
        <NavigationRail />

        <Sidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onCreateConversation={handleCreateConversation}
          user={user}
          onLogout={handleLogout}
        />

        <ChatWindow
          chat={selectedChat}
          onToggleDetails={() => setShowDetails((prev) => !prev)}
          isDetailsOpen={showDetails}
          onToggleMute={handleToggleMute}
        />

        {showDetails && selectedChat && <DetailsPanel chat={selectedChat} />}
      </div>
    </main>
  );
}
