import { ACCESS_COOKIE_NAME, accessCookieOptions } from "../config/cookie.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import { createAccessToken } from "../utils/token.util.js";
import User from "../models/user.model.js";
import {
    verifyEmailOtp,
    issueEmailOtp,
} from "../services/email-verification.service.js";

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
        const user = await loginUser(
            res.locals.validated.body
        );

        const accessToken = createAccessToken(user.id);
        res.cookie(
            ACCESS_COOKIE_NAME,
            accessToken,
            accessCookieOptions
        );

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
                message: "Authentication required"
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
}

export const handleLogout = (req, res, next) => {
    try {
        res.clearCookie(ACCESS_COOKIE_NAME, accessCookieOptions);
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        next(error)
    }
}


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