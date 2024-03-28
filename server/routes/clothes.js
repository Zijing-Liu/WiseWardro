const express = require("express");
const router = express.Router();

// const { analyzer } = require("../controllers/analyzer");
// const getImages = require("../controllers/getImages.js");

// Get a specific user by id
router.get("/:id", (req, res) => {
  res.send(`Sending back all clothes for user with ID ${req.params.id}`);
});
router.get("/", (req, res) => {
  res.send("welcome");
});

router.post("/", (req, res) => {
  errorMessages = [];
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  if (!req.body.style) {
    return res.status(400).send("No style is selected");
  }

  // Files are sent with dynamic keys like image0, image1, etc.
  Object.keys(req.files).forEach((key) => {
    const file = req.files[key];
    // Process the file here (e.g., save to disk)
    console.log(`Received file: ${file.name}`);

    // Example: saving the file
    // const uploadPath = __dirname + "/uploads/" + file.name;
    // file.mv(uploadPath, function (err) {
    //   if (err) {
    //     return res.status(500).send(err);
    //   }
    // });
  });

  res.send("Files received!");
});

module.exports = router;
