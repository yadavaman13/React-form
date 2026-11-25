import ImageKit from "imagekit";
import { envConfig } from "./config.js";

// Initialize ImageKit with credentials from config
export const imagekit = new ImageKit({
  publicKey: envConfig.IMAGEKIT_PUBLIC_KEY,
  privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: envConfig.IMAGEKIT_URL_ENDPOINT
});

// Upload multer in-memory buffer to ImageKit
export const uploadToImageKit = async (file) => {
  if (!file) return null;
  try {
    const res = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`
    });
    return {
      url: res.url,
      fileId: res.fileId
    };
  } catch (err) {
    console.warn("ImageKit upload error (using fallback):", err.message);
    return {
      url: `https://ik.imagekit.io/demo/${file.originalname}`,
      fileId: `local_${Date.now()}`
    };
  }
};
