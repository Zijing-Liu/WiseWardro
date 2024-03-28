const express = require("express");
const router = express.Router();
const { formDataValidator } = require("../Middlewares/formDataValidator");
const { analyzer } = require("../controllers/analyzer");
const { processImages } = require("../Middlewares/recieveFilesAndSaveAsUrl");
// Get a specific user by id
router.get("/:id", (req, res) => {
  res.send(`Sending back all clothes for user with ID ${req.params.id}`);
});
router.get("/", (req, res) => {
  res.send("welcome");
});
router.post("/", formDataValidator, analyzer);

module.exports = router;
