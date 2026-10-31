import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import AboutPage from "@/pages/AboutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";

import { AuthProvider } from "@/context/AuthContext";
import GuestRoute from "@/components/auth/GuestRoute";

function AppContent() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#22231F]">
      <Header />

      <Routes>
        <Route path="/" element={<AboutPage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>
      </Routes>

      <Footer />
    </div>
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
