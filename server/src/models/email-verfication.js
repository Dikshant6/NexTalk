
import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
        },

        codeHash: {
            type: String,
            required: true,
            select: false,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 5,
        },

        lastSentAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// One active verification record per email.
emailVerificationSchema.index(
    { email: 1 },
    { unique: true },
);

// MongoDB automatically deletes expired records eventually.
emailVerificationSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
);

const EmailVerification = mongoose.model(
    "EmailVerification",
    emailVerificationSchema,
);

export default EmailVerification;
