import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export default function AuthForm({
  isRegister,
  email,
  setEmail,
  password,
  setPassword,
  onToggleMode,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [internalEmail, setInternalEmail] = useState(
    location.state?.email || ""
  );
  const [internalPassword, setInternalPassword] = useState("");

  const currentEmail = email !== undefined ? email : internalEmail;
  const handleEmailChange = (val) => {
    if (setEmail) setEmail(val);
    else setInternalEmail(val);
  };

  const currentPassword = password !== undefined ? password : internalPassword;
  const handlePasswordChange = (val) => {
    if (setPassword) setPassword(val);
    else setInternalPassword(val);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    location.state?.successMessage || location.state?.message || ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const submittedEmail = formData.get("email") || currentEmail;
    const submittedPassword = formData.get("password") || currentPassword;

    try {
      if (isRegister) {
        await authService.register({
          username: formData.get("username"),
          displayName: formData.get("displayName"),
          email: submittedEmail,
          password: submittedPassword,
        });

        // Navigate directly to email verification screen with safe state
        navigate("/verify-email", {
          state: {
            email: submittedEmail,
            fromRegistration: true,
          },
        });
      } else {
        await authService.login({
          email: submittedEmail,
          password: submittedPassword,
        });

        setSuccess("Login successful!");
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto w-full max-w-md md:ml-auto">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777A62]">
        {isRegister ? "Create your account" : "Your space awaits"}
      </p>

      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        {isRegister ? "Join NexTalk." : "Welcome back."}
      </h2>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {children}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={currentEmail}
            onChange={(event) => handleEmailChange(event.target.value)}
            required
            maxLength={254}
            className="h-12 rounded-md border-[#DCD7CC] bg-transparent px-4 shadow-none focus-visible:ring-[#777A62]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Enter your password"
            value={currentPassword}
            onChange={(event) => handlePasswordChange(event.target.value)}
            required
            minLength={isRegister ? 8 : 1}
            maxLength={128}
            className="h-12 rounded-md border-[#DCD7CC] bg-transparent px-4 shadow-none focus-visible:ring-[#777A62]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-md bg-[#22231F] text-sm font-medium text-[#F5F2EA] shadow-none hover:bg-[#3B3C34]"
        >
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Sign in"}
          {!loading && (
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          )}
        </Button>
      </form>

      <SocialAuthButtons isRegister={isRegister} />

      <p className="mt-6 text-sm text-[#68685F]">
        {isRegister ? "Already have an account?" : "New to NexTalk?"}{" "}
        <Link
          to={isRegister ? "/login" : "/register"}
          onClick={onToggleMode}
          className="font-semibold text-[#22231F] underline decoration-[#777A62] underline-offset-4 transition-colors hover:text-[#777A62]"
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>

      <p className="mt-10 text-xs leading-5 text-[#89877D]">
        By continuing, you agree to use NexTalk respectfully and keep your
        account credentials secure.
      </p>
    </div>
  );
}
