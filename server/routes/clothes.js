const express = require("express");
const router = express.Router();
const { analyzeImg } = require("../controllers/compareImages");
// Get a specific user by id
router.get("/:id", (req, res) => {
  res.send(`Sending back all clothes for user with ID ${req.params.id}`);
});

router.get("/", analyzeImg);
module.exports = router;
