import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";

export const uploadAvatarToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "nextalk/avatars",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "face",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

export const deleteAvatarFromCloudinary = async (publicId) => {
  if (!publicId) return;

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  return result;
};