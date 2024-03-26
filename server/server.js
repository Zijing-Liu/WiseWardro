const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT;
const usersRoutes = require("./routes/users");
const clothesRoutes = require("./routes/clothes");
const outfitsRoutes = require("./routes/outfits");

app.use("/users", usersRoutes);
app.use("/clothes", clothesRoutes);
app.use("/outfits", outfitsRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
