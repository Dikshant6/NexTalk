import { OAuth2Client } from "google-auth-library";
import { randomInt } from "node:crypto";

import { env } from "../config/env.js";
import User from "../models/user.model.js";

const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.FRONTEND_URL,
);

const generateUsername = async (email) => {
  const baseUsername = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 20);

  const safeBase = baseUsername.length >= 3 ? baseUsername : `user_${baseUsername}`;

  let username;

  do {
    username = `${safeBase}_${randomInt(100000, 999999)}`;
  } while (await User.exists({ username }));

  return username;
};

export const authenticateWithGoogle = async (code) => {
  // 1. Exchange authorization code for Google tokens.
  const { tokens } = await googleClient.getToken({
    code,
    redirect_uri: env.FRONTEND_URL,
  });

  if (!tokens.id_token) {
    throw new Error("Google did not return an ID token");
  }

  // 2. Verify Google's ID token.
  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    const error = new Error("Google account could not be verified");
    error.statusCode = 401;
    throw error;
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();

  // 3. Check whether this Google account already exists.
  let user = await User.findOne({ googleId });

  if (user) {
    if (user.accountStatus !== "active") {
      const error = new Error("This account is unavailable");
      error.statusCode = 403;
      throw error;
    }

    return user;
  }

  // 4. Do not automatically link accounts by email.
  const existingEmailUser = await User.findOne({ email });

  if (existingEmailUser) {
    const error = new Error(
      "An account with this email already exists. Please sign in using your existing method.",
    );
    error.statusCode = 409;
    throw error;
  }

  // 5. Create a new Google-only user.
  const username = await generateUsername(email);

  user = await User.create({
    username,
    displayName: payload.name || email.split("@")[0],
    email,
    googleId,
    avatarUrl: payload.picture || null,
    emailVerified: true,
  });

  return user;
};
