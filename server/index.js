const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT;
const usersRoutes = require("./routes/users");
const clothesRoutes = require("./routes/clothes");
const outfitsRoutes = require("./routes/outfits");
const path = require("path");
// const staticPath = path.join(__dirname, "/pictures");
app.use(cors());
// max size for the request body is 1mb
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
// server static files in the public folder
app.use("/public", express.static(path.join(__dirname, "../client/public")));

app.use("/api/users", usersRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitsRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
