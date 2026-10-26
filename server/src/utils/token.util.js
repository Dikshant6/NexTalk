import JWT from "jsonwebtoken"
import { env } from "../config/env.js"

export const createAccessToken = (userId) => {
    return JWT.sign({}, env.JWT_ACCESS_SECRET, {
        algorithm: "HS256",
        subject: userId.toString(),
        issuer: "nextalk-api",
        audience: "nextalk-client",
        expiresIn: "30m",
    });
}