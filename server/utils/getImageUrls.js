const path = require("path");
const fs = require("fs");

const publicDirectory = path.join(__dirname, "../../client/public/images");
const baseUrl = "http://localhost:8080/public/images";
console.log(publicDirectory);
function getImageUrls(directory, baseUrl) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      next(err);
      return;
    }

    const imageUrls = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map((file) => path.join(baseUrl, file));

    return imageUrls;
  });
}
// getImageUrls(publicDirectory, baseUrl);
console.log(getImageUrls(publicDirectory, baseUrl));
