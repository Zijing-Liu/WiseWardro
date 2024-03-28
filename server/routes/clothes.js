const express = require("express");
const router = express.Router();

const { analyzer } = require("../controllers/analyzer");
// const getImages = require("../controllers/getImages.js");

// Get a specific user by id
router.get("/:id", (req, res) => {
  res.send(`Sending back all clothes for user with ID ${req.params.id}`);
});
router.get("/", (req, res) => {
  res.send("welcome");
});

router.post("/", (req, res) => {
  res.send("image recieved");
});

module.exports = router;
