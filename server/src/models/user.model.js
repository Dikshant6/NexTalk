import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 30,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    emailVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false },
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
