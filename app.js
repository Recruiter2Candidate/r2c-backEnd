const dotenv = require("dotenv");
const express = require("express");
const connectToDb = require("./src/config/connectDB");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");

dotenv.config();

const app = express();

connectToDb();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("server is up and running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
