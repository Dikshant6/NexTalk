import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG and WebP images are allowed."));
    }

    callback(null, true);
  },
});

// Verify actual file content, not just its MIME type.
export const validateAvatarContent = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required.",
      });
    }

    const detectedType = await fileTypeFromBuffer(req.file.buffer);

    if (!detectedType || !ALLOWED_IMAGE_TYPES.includes(detectedType.mime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image file.",
      });
    }

    req.file.detectedMimeType = detectedType.mime;

    next();
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = upload.single("avatar");
