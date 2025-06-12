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

export default router;
