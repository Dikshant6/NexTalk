import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

function GoogleLogo({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 2.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleLogo({ className = "size-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.96c.64-.78 1.08-1.86.96-2.94-1.04.04-2.3.69-3.03 1.49-.58.63-1.09 1.72-.95 2.78 1.17.09 2.37-.56 3.02-1.33z" />
    </svg>
  );
}

export default function SocialAuthButtons({ isRegister = false }) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async ({ code }) => {
      try {
        setLoading(true);
        setNotice("");

        await authService.googleLogin(code);

        const isAuthenticated = await refreshUser();

        if (!isAuthenticated) {
          throw new Error("Google session verification failed.");
        }

        navigate("/chats", { replace: true });
      } catch (error) {
        setNotice(error.message || "Google authentication failed.");
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setNotice("Google sign-in was cancelled or failed.");
    },
  });

  const handleGoogleClick = () => {
    setNotice("");
    googleLogin();
  };

  const handleAppleClick = () => {
    setNotice("Apple sign-in will be available soon.");
  };

  return (
    <div className="w-full">
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-app-border" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-app px-3 font-medium tracking-wider text-primary-hover">
            or
          </span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          aria-label={
            isRegister ? "Sign up with Google" : "Sign in with Google"
          }
          onClick={handleGoogleClick}
          disabled={loading}
          className="inline-flex h-10 w-10 cursor-pointer align-center items-center justify-center rounded-full text-ink transition-opacity duration-150 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleLogo />
        </button>

        {/*
        <button
          type="button"
          onClick={handleAppleClick}
          disabled={loading}
          aria-label={isRegister ? "Sign up with Apple" : "Sign in with Apple"}
          className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-app-border bg-surface text-ink transition-all duration-150 hover:border-primary hover:bg-surface-secondary"
        >
          <AppleLogo />
        </button>
        */}
      </div>

      {notice && (
        <p
          role="alert"
          className="mt-3 text-center text-xs text-text-secondary"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
