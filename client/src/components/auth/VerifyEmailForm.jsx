import { useState, useEffect, useRef, useId } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import {
  Mail,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Edit2,
  Check,
  X,
} from "lucide-react";

/**
 * Masks an email address for privacy (e.g., alex.miller@example.com -> al••••r@example.com)
 */
function maskEmail(emailAddress) {
  if (!emailAddress || typeof emailAddress !== "string") return "";
  const parts = emailAddress.trim().split("@");
  if (parts.length !== 2) return emailAddress;

  const [local, domain] = parts;
  if (!local || !domain) return emailAddress;

  let maskedLocal = "";
  if (local.length <= 2) {
    maskedLocal = `${local[0]}*`;
  } else if (local.length <= 4) {
    maskedLocal = `${local[0]}**${local.slice(-1)}`;
  } else {
    maskedLocal = `${local.slice(0, 2)}••••${local.slice(-1)}`;
  }

  return `${maskedLocal}@${domain}`;
}

export default function VerifyEmailForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const otpInputId = useId();

  // Navigation state passed from registration or login redirect
  const initialEmail = location.state?.email || "";
  const fromRegistration = Boolean(location.state?.fromRegistration);

  const [email, setEmail] = useState(initialEmail);
  const [tempEmail, setTempEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isMasked, setIsMasked] = useState(true);

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState("");
  const [resendNotice, setResendNotice] = useState("");

  // Countdown timer for resending code (starts at 60s if arrived from registration, otherwise 0)
  const [cooldown, setCooldown] = useState(fromRegistration ? 60 : 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  // Handle OTP verification
  const handleVerify = async (e) => {
    if (e) e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please provide your email address to continue.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setError("");
    setResendNotice("");
    setIsSubmitting(true);

    try {
      const response = await authService.verifyEmail({
        email: normalizedEmail,
        code,
      });

      setIsSuccess(true);

      // Give the user a brief visual confirmation before redirecting to login
      setTimeout(() => {
        navigate("/login", {
          state: {
            email: normalizedEmail,
            successMessage:
              response.message ||
              "Email verified successfully. You can now log in.",
          },
        });
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          "The code you entered is invalid or has expired. Please check and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resending verification code
  const handleResend = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email address before requesting a new code.");
      return;
    }

    setError("");
    setResendNotice("");
    setIsResending(true);

    try {
      const response = await authService.resendVerification({
        email: normalizedEmail,
      });

      setResendNotice(
        response.message ||
          "A fresh 6-digit verification code has been dispatched to your email."
      );
      setCooldown(60);
      setCode("");
    } catch (err) {
      setError(
        err.message || "Failed to dispatch verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSaveEmail = () => {
    const trimmed = tempEmail.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setEmail(trimmed);
    setIsEditingEmail(false);
    setError("");
    setResendNotice("");
  };

  const handleCancelEmailEdit = () => {
    setTempEmail(email);
    setIsEditingEmail(false);
  };

  return (
    <div className="mx-auto w-full max-w-md md:ml-auto">
      {/* Category / Context label */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777A62]">
        Security & verification
      </p>

      {/* Main Heading */}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        Verify your email
      </h2>

      {/* Supporting text */}
      <p className="mt-2 text-sm leading-6 text-[#68685F]">
        We've sent a 6-digit verification code to your email address. Enter the
        code below to activate your NexTalk account.
      </p>

      {/* Email badge or Direct Visit Email Input */}
      <div className="mt-6">
        {email && !isEditingEmail ? (
          <div className="flex items-center justify-between rounded-lg border border-[#DCD7CC] bg-[#EFECE3]/70 px-4 py-3 text-sm transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="size-4 shrink-0 text-[#777A62]" />
              <span
                className="font-medium text-[#22231F] truncate"
                title={email}
              >
                {isMasked ? maskEmail(email) : email}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3 text-xs">
              <button
                type="button"
                onClick={() => setIsMasked(!isMasked)}
                className="text-[#777A62] hover:text-[#22231F] transition-colors underline decoration-[#777A62]/40 underline-offset-2 cursor-pointer"
                aria-label={isMasked ? "Reveal full email address" : "Mask email address"}
              >
                {isMasked ? "Reveal" : "Mask"}
              </button>

              <span className="text-[#DCD7CC]" aria-hidden="true">
                •
              </span>

              <button
                type="button"
                onClick={() => {
                  setTempEmail(email);
                  setIsEditingEmail(true);
                }}
                disabled={isSubmitting || isSuccess}
                className="inline-flex items-center gap-1 text-[#777A62] hover:text-[#22231F] transition-colors underline decoration-[#777A62]/40 underline-offset-2 cursor-pointer disabled:opacity-50"
                aria-label="Change email address"
              >
                <Edit2 className="size-3" />
                Change
              </button>
            </div>
          </div>
        ) : (
          /* Missing email or inline editing state */
          <div className="space-y-2 rounded-lg border border-[#DCD7CC] bg-[#EFECE3]/40 p-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="verification-email"
                className="text-xs font-semibold uppercase tracking-[0.1em] text-[#777A62]"
              >
                {email ? "Update email address" : "Account email address"}
              </label>

              {email && (
                <button
                  type="button"
                  onClick={handleCancelEmailEdit}
                  className="text-xs text-[#68685F] hover:text-[#22231F] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                id="verification-email"
                type="email"
                placeholder="you@example.com"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                disabled={isSubmitting || isSuccess}
                className="h-10 rounded-md border-[#DCD7CC] bg-white/70 px-3 text-sm shadow-none focus-visible:ring-[#777A62]"
              />

              <Button
                type="button"
                onClick={handleSaveEmail}
                disabled={isSubmitting || isSuccess || !tempEmail.trim()}
                className="h-10 shrink-0 rounded-md bg-[#22231F] px-4 text-xs font-medium text-[#F5F2EA] shadow-none hover:bg-[#3B3C34]"
              >
                <Check className="size-3.5 mr-1" />
                {email ? "Update" : "Set email"}
              </Button>
            </div>

            {!initialEmail && (
              <p className="text-xs text-[#89877D]">
                Enter the email address you used during registration.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Verification Form */}
      <form onSubmit={handleVerify} className="mt-7 space-y-6">
        {/* Error Feedback */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/80 p-3.5 text-sm text-red-800 transition-all animate-in fade-in"
          >
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1 text-xs leading-relaxed sm:text-sm">
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              aria-label="Dismiss error"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Resend Notice */}
        {resendNotice && !error && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-[#DCD7CC] bg-[#EFECE3] p-3.5 text-sm text-[#45463F] transition-all animate-in fade-in"
          >
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-[#777A62]" />
            <div className="flex-1 text-xs leading-relaxed sm:text-sm">
              {resendNotice}
            </div>
          </div>
        )}

        {/* Verification Success Feedback */}
        {isSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3.5 text-sm text-emerald-900 transition-all animate-in fade-in"
          >
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 text-xs font-medium leading-relaxed sm:text-sm">
              Email verified successfully! Redirecting you to sign in...
            </div>
          </div>
        )}

        {/* OTP Input Field */}
        <div className="space-y-2">
          <label
            htmlFor={otpInputId}
            className="block text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#777A62]"
          >
            6-digit security code
          </label>

          <div className="flex justify-center py-2">
            <InputOTP
              id={otpInputId}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={(value) => {
                setCode(value);
                if (error) setError("");
              }}
              disabled={isSubmitting || isSuccess || !email}
              autoFocus
              aria-label="Six-digit verification code"
              containerClassName="justify-center"
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator className="mx-1 sm:mx-2" />

              <InputOTPGroup className="gap-1.5 sm:gap-2">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          type="submit"
          disabled={isSubmitting || code.length !== 6 || isSuccess || !email}
          className="h-12 w-full rounded-md bg-[#22231F] text-sm font-medium text-[#F5F2EA] shadow-none hover:bg-[#3B3C34] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Verifying code...
            </span>
          ) : isSuccess ? (
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              Verified! Redirecting...
            </span>
          ) : (
            <>
              Verify email
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </>
          )}
        </Button>
      </form>

      {/* Resend Code Section */}
      <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#DCD7CC] pt-5 text-sm sm:flex-row">
        <span className="text-xs text-[#68685F] sm:text-sm">
          Didn't receive the code?
        </span>

        {cooldown > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD7CC] bg-[#EFECE3] px-3 py-1 text-xs font-medium text-[#777A62]">
            <Clock className="size-3" />
            Resend in {cooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isSubmitting || isSuccess || !email}
            className="inline-flex items-center gap-1.5 font-semibold text-[#22231F] underline decoration-[#777A62] underline-offset-4 hover:text-[#777A62] transition-colors disabled:opacity-50 disabled:no-underline cursor-pointer text-xs sm:text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Sending code...
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" />
                Resend code
              </>
            )}
          </button>
        )}
      </div>

      {/* Code Expiration Notice */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#89877D]">
        <Clock className="size-3.5 shrink-0 text-[#777A62]" />
        <span>Verification codes expire 5 minutes after being issued.</span>
      </div>

      {/* Navigation Links */}
      <div className="mt-8 flex items-center justify-between border-t border-[#DCD7CC] pt-5 text-xs sm:text-sm">
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 font-medium text-[#68685F] hover:text-[#22231F] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign up
        </Link>

        <Link
          to="/login"
          className="font-medium text-[#22231F] underline decoration-[#777A62] underline-offset-4 hover:text-[#777A62] transition-colors"
        >
          Sign in instead
        </Link>
      </div>

      {/* Terms footnote consistent with AuthForm */}
      <p className="mt-8 text-xs leading-5 text-[#89877D]">
        Need help? Ensure you've checked your spam folder before requesting a
        fresh verification code.
      </p>
    </div>
  );
}
