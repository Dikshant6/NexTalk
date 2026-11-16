import { ACCESS_COOKIE_NAME, accessCookieOptions } from "../config/cookie.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import { createAccessToken } from "../utils/token.util.js";
import User from "../models/user.model.js";
import {
  verifyEmailOtp,
  issueEmailOtp,
} from "../services/email-verification.service.js";
import { authenticateWithGoogle } from "../services/google-auth.service.js";

export const handleRegister = async (req, res, next) => {
  try {
    const user = await registerUser(res.locals.validated.body);

    return res.status(201).json({
      success: true,
      message: "Account created. Check your email for a verification code.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogin = async (req, res, next) => {
  try {
    const user = await loginUser(res.locals.validated.body);

    const accessToken = createAccessToken(user.id);
    res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Credentials verified successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user || user.accountStatus !== "active") {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = (req, res, next) => {
  try {
    res.clearCookie(ACCESS_COOKIE_NAME, accessCookieOptions);
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const handleVerifyEmail = async (req, res, next) => {
  try {
    const { email, code } = res.locals.validated.body;

    await verifyEmailOtp(email, code);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

export const handleResendEmailOtp = async (req, res, next) => {
  try {
    const { email } = res.locals.validated.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    // Avoid revealing whether an email has an account.
    if (user && !user.emailVerified && user.accountStatus === "active") {
      await issueEmailOtp(normalizedEmail);
    }

    return res.status(200).json({
      success: true,
      message:
        "If an eligible unverified account exists, a verification email will be sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const handleGoogleAuth = async (req, res, next) => {
  try {
    // 1. Verify the popup request header
    if (req.get("X-Requested-With") !== "XmlHttpRequest") {
      const error = new Error("Invalid authentication request");
      error.statusCode = 400;
      throw error;
    }

    // 2. Authenticate the user through Google
    const user = await authenticateWithGoogle(req.body.code);

    // 3. Generate NexTalk's own access token
    const accessToken = createAccessToken(user._id);

    // 4. Store the token in a an HttpOnly cookie
    res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);

    // 5. Send user information to the frontend.
    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};
