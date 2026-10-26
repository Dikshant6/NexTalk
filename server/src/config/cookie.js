import { env } from "./env.js";

export const ACCESS_COOKIE_NAME = "nextalk_access";

export const accessCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
};
