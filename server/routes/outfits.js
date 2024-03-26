const express = require("express");
const router = express.Router();

// Get a specific user by id
router.get("/:id", (req, res) => {
  res.send(`Sending back all outfits for user with  ID ${req.params.id}`);
});

module.exports = router;
