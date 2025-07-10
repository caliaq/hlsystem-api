// imports
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads/license-plates");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Always use the same filename: plate.jpg
    cb(null, "plate.jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

export default {
  // Handle license plate image upload
  uploadLicensePlate: [
    upload.any(), // Accept any field name
    async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            success: false,
            error: "No file uploaded. Please upload an image file.",
          });
        }

        // Use the first uploaded file
        const uploadedFile = req.files[0];

        // Return success response - always overwrites plate.jpg
        res.status(200).json({
          success: true,
          data: {
            message: "License plate image updated successfully",
            filename: "plate.jpg",
            originalFieldName: uploadedFile.fieldname,
            size: uploadedFile.size,
            updatedAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  // Serve the current license plate image
  getLicensePlateImage: async (req, res, next) => {
    try {
      const filePath = path.join(uploadsDir, "plate.jpg");

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: "No license plate image found",
        });
      }

      // Get file stats
      const stats = fs.statSync(filePath);

      // Set content type for JPEG
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Length", stats.size);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  },
};
