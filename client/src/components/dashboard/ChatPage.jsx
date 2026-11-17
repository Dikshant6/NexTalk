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
    <main className="h-dvh min-h-[600px] bg-[#F3F0E9] p-4 text-[#242521]">
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
          user={user}
          onLogout={handleLogout}
        />

        <ChatWindow
          chat={selectedChat}
          onToggleDetails={handleToggleDetails}
          isDetailsOpen={showDetails}
        />

        {showDetails && selectedChat && <DetailsPanel chat={selectedChat} />}
      </div>
    </main>
  );
}
