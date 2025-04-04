const cloudinary = require("../config/cloudinary");

/**
 * Uploads image to Cloudinary in WebP format.
 * @param {string} filePath - Local file path.
 * @param {string} folder - Folder name in Cloudinary.
 * @returns {Promise<string>} - Cloudinary URL of uploaded image.
 */
const uploadImageToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      format: "webp",
      quality: "auto:good",
      transformation: [{ width: 800, crop: "limit" }],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

const extractCloudinaryId = (url) => {
  if (!url) return null;

  // Match the public ID for both questions and options
  const match = url.match(/mock-test\/(questions|options)\/(.+?)\./);

  return match ? match[2] : null;
};

module.exports = { uploadImageToCloudinary, extractCloudinaryId };
