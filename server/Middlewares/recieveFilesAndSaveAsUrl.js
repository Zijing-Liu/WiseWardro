const fs = require("fs");
const path = require("path");
const processImages = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  if (!req.body.style) {
    return res.status(400).send("No style is selected");
  }

  const messages = [];
  const errorOccurred = Object.keys(req.files).some((key) => {
    const file = req.files[key];
    const base64String = file.data.toString("base64");
    const filePath = path.join(__dirname, "../uploads", `${key}.txt`);

    try {
      fs.writeFileSync(filePath, base64String);
      messages.push(`${key} converted to base64 and saved.`);
      return false; // No error, continue processing
    } catch (err) {
      messages.push(`Error saving ${key}: ${err.message}`);
      return true; // Error occurred, stop processing
    }
  });

  if (errorOccurred) {
    res.status(500).send(messages.join("\n"));
  } else {
    res.status(200).send(messages.join("\n"));
  }
  next();
};
module.exports = { processImages };
