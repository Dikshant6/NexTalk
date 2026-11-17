import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";

import GuestRoute from "@/components/auth/GuestRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import SiteLayout from "@/components/layout/SiteLayout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import AboutPage from "@/pages/AboutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ChatPage from "@/components/dashboard/ChatPage";

function AppContent() {
  return (
    <Routes>
      {/* Public application */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<AboutPage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>
      </Route>

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chats" element={<DashboardLayout />}>
          <Route index element={<ChatPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
