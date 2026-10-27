import { ACCESS_COOKIE_NAME, accessCookieOptions } from "../config/cookie.js";
import User from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/password.util.js";

export const registerUser = async ({
    username,
    displayName,
    email,
    password,
}) => {
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        const error = new Error("Username or email is already taken");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await hashPassword(password);

    try {
        const user = await User.create({
            username,
            displayName,
            email,
            passwordHash,
        });

        return {
            id: user._id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt,
        };
    } catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error(
                "Username or email is already taken"
            );
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

export const loginUser = async ({ email, password }) => {

    try {
        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;

        }

        if (user.accountStatus !== "active") {
            const error = new Error("Account is unavailable");
            error.statusCode = 403;
            throw error;
        }

        return {
            id: user._id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
        };
    } catch (error) {
        throw error;
    }
}
