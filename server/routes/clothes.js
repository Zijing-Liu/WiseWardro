const express = require("express");
const router = express.Router();
const { formDataValidator } = require("../Middlewares/formDataValidator");
const { analyzer } = require("../controllers/analyzer");
const { saveImages } = require("../Middlewares/saveImages");
// Get a specific user by id
router.get("/:id", (req, res) => {
  res.send(`Sending back all clothes for user with ID ${req.params.id}`);
});
router.get("/", (req, res) => {
  res.send("welcome");
});
router.post("/", formDataValidator, saveImages, analyzer);
//router.post("/", formDataValidator, saveImages);
module.exports = router;
