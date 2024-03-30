const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
// Function to reduce image size/quality and convert to Base64
async function convertImageToBase64(filePath) {
  try {
    // Reduce the size or quality here. Adjust the resize width, height, and quality as needed
    const buffer = await sharp(filePath)
      .resize({ width: 150 }) // Resize to 800 pixels in width, keeping aspect ratio
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    // Convert to Base64
    const base64 = `data:image/jpg;base64,${buffer.toString("base64")}`;
    return base64;
  } catch (error) {
    console.error("Error processing image:", error);
  }
}
// helper function to process images
const processImages = async (req) => {
  const uploadsDir = path.join(__dirname, "../../uploads");
  const imageUrls = [];

  for (const key of Object.keys(req.files)) {
    const filePath = path.join(uploadsDir, key);
    const fileExtension = req.files[key].mimetype.split("/")[1];
    const fullFilePath = `${filePath}.${fileExtension}`;
    console.log(fullFilePath);

    try {
      // Check if the file exists
      if (fs.existsSync(fullFilePath)) {
        const url = await convertImageToBase64(fullFilePath);
        console.log(`Loaded and encoded image for ${key}`);
        imageUrls.push(url);
      } else {
        console.log(`No image found for ${key}`);
      }
    } catch (err) {
      console.error(`Error loading image for ${key}: ${err.message}`);
    }
  }

  return imageUrls;
};
module.exports = { processImages };
