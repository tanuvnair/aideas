import express from "express";
import supabase from "../lib/supabase.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Confirmation email sent",
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  res.status(200).json({ session: data.session, user: data.user });
});

router.post("/signout", async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(401).json({ error: error.message });
  res.status(200).json({ message: "You have successfully signed out." });
});

router.get("/google", async (req, res) => {
  const redirectTo = supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Enter the frontend URL here later
      redirectTo: "http://localhost:4000/auth/callback",
    },
  });
});

router.get("/callback", (req, res) => {
  res.send("Google Sign-in complete. You can close this window.");
});

export default router;
