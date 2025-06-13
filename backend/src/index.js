import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import ideasRoutes from "./routes/ideas.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/ideas", ideasRoutes);

// The server starts listening
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
