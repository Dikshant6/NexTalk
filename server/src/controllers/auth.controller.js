import { ACCESS_COOKIE_NAME, accessCookieOptions } from "../config/cookie.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import { createAccessToken } from "../utils/token.util.js";
import User from "../models/user.model.js";

export const handleRegister = async (req, res, next) => {
    try {

        const user = await registerUser(res.locals.validated.body);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
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