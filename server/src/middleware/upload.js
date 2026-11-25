import multer from "multer";

// memoryStorage keeps file in req.file.buffer (no temp disk files needed)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
