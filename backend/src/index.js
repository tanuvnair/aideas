import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// The server starts listening
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
