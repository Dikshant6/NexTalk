import User from "../models/user.model.js";
import {
  uploadAvatarToCloudinary,
  deleteAvatarFromCloudinary,
} from "../services/cloudinary.service.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.auth.userId,
      accountStatus: "active",
    }).select("username displayName email avatarUrl bio");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
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
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.auth.userId,
      accountStatus: "active",
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { displayName, bio } = res.locals.validated.body;

    if (displayName !== undefined) {
      user.displayName = displayName;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
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
};

export const uploadProfileAvatar = async (req, res, next) => {
  let uploadedAvatar;
  try {
    const user = User.findOne({
      _id: req.auth.userId,
      accountStatus: "active",
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    // preserving old avatar id
    const oldPublicId = user.avatarPublicId;

    // uploading new avatar to cloudinary
    uploadedAvatar = await uploadAvatarToCloudinary(req.file.buffer);

    // updated the user's profile
    user.avatarUrl = uploadedAvatar.secureUrl;
    user.avatarPublicId = uploadedAvatar.publicId;

    await user.save();

    if (oldPublicId) {
      try {
        await deleteAvatarFromCloudinary(oldPublicId);
      } catch (deleteError) {
        // new avatar is already saved so delete the old one to save storage
        console.error("failed to delete previous avatar: deleteError.message");
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profile: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    if (uploadedAvatar?.publicId) {
      try {
        await deleteAvatarFromCloudinary(uploadedAvatar.publicId);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded avatar:",
          cleanupError.message,
        );
      }
    }

    next(error);
  }
};
