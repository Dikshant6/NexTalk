import JWT from "jsonwebtoken";
import { env } from "../config/env.js";
import { ACCESS_COOKIE_NAME } from "../config/cookie.js";

export const requireAuth = (req, res, next) => {
    const token = req.cookies?.[ACCESS_COOKIE_NAME];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    try {
        const payload = JWT.verify(token, env.JWT_ACCESS_SECRET, {
            algorithms: ["HS256"],
            issuer: "nextalk-api",
            audience: "nextalk-client"
        })
        const isValidObjectId = /^[a-f\d]{24}$/i.test(payload?.sub);
        if (
            typeof payload === "string" ||
            typeof payload.sub !== "string" ||
            isValidObjectId
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token",
            });
        }

        req.auth = {
            userId: payload.sub,
        };

        return next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or required authentication token",
        });
    }
};
