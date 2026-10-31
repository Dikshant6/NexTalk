
import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { env } from "../config/env.js";
import User from "../models/user.model.js";
import EmailVerification from "../models/email-verfication.js";
import { sendVerificationEmail } from "./email.service.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function createOtp() {
    return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashOtp(email, code) {
    return createHmac("sha256", env.OTP_HASH_SECRET)
        .update(`${email}:${code}`)
        .digest("hex");
}

function safeEqualHex(a, b) {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");

    return left.length === right.length && timingSafeEqual(left, right);
}

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export async function issueEmailOtp(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date();

    const existing = await EmailVerification.findOne({
        email: normalizedEmail,
    });

    if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
        throw createError("Please wait before requesting another code.", 429);
    }

    const code = createOtp();
    const record = await EmailVerification.findOneAndUpdate(
        { email: normalizedEmail },
        {
            $set: {
                codeHash: hashOtp(normalizedEmail, code),
                expiresAt: new Date(now.getTime() + OTP_TTL_MS),
                attempts: 0,
                lastSentAt: now,
            },
        },
        {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        },
    );

    try {
        await sendVerificationEmail({
            to: normalizedEmail,
            code,
        });
    } catch {
        await EmailVerification.deleteOne({ _id: record._id });
        throw createError(
            "We couldn't send the verification email. Please try again shortly.",
            503,
        );
    }

    return { sent: true };
}

export async function verifyEmailOtp(email, code) {
    const normalizedEmail = email.trim().toLowerCase();
    const record = await EmailVerification.findOne({
        email: normalizedEmail,
    }).select("+codeHash");

    if (!record) {
        throw createError("Invalid or expired verification code.", 400);
    }

    if (record.expiresAt <= new Date()) {
        await EmailVerification.deleteOne({ _id: record._id });
        throw createError("Invalid or expired verification code.", 400);
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        await EmailVerification.deleteOne({ _id: record._id });
        throw createError("Too many attempts. Request a new code.", 429);
    }

    const candidateHash = hashOtp(normalizedEmail, code);

    if (!safeEqualHex(candidateHash, record.codeHash)) {
        const updated = await EmailVerification.findOneAndUpdate(
            { _id: record._id, attempts: { $lt: MAX_ATTEMPTS } },
            { $inc: { attempts: 1 } },
            { new: true },
        );

        if (!updated || updated.attempts >= MAX_ATTEMPTS) {
            throw createError("Too many attempts. Request a new code.", 429);
        }

        throw createError("Invalid or expired verification code.", 400);
    }

    // Consume the OTP atomically so it cannot be reused.
    const consumed = await EmailVerification.findOneAndDelete({
        _id: record._id,
        codeHash: record.codeHash,
        attempts: { $lt: MAX_ATTEMPTS },
        expiresAt: { $gt: new Date() },
    });

    if (!consumed) {
        throw createError("Invalid or expired verification code.", 400);
    }

    const result = await User.updateOne(
        { email: normalizedEmail, emailVerified: false },
        { $set: { emailVerified: true } },
    );

    if (result.matchedCount === 0) {
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            throw createError("Account not found.", 404);
        }

        if (!user.emailVerified) {
            throw createError("Unable to verify this email. Please try again.", 500);
        }
    }

    return { verified: true };
}
