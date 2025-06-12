import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Parsed JSON body:", req.body);
  next();
});

app.use("/auth", authRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
