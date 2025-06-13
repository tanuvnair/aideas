import express from "express";
import supabase from "../lib/supabase.js";
import {
  sendSuccess,
  sendError,
  sendValidationError,
  sendAuthError,
  sendServerError,
  createError,
} from "../utils/responseHelpers.js";

const router = express.Router();

// Input validation helper
const validateAuthInput = (email, password) => {
  const errors = [];

  if (!email || !email.trim()) {
    errors.push(createError("email", "REQUIRED", "Email is required"));
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push(
      createError(
        "email",
        "INVALID_FORMAT",
        "Please provide a valid email address"
      )
    );
  }

  if (!password || !password.trim()) {
    errors.push(createError("password", "REQUIRED", "Password is required"));
  } else if (password.length < 6) {
    errors.push(
      createError(
        "password",
        "TOO_SHORT",
        "Password must be at least 6 characters long"
      )
    );
  }

  return errors;
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    const validationErrors = validateAuthInput(email, password);
    if (validationErrors.length > 0) {
      return sendValidationError(res, validationErrors);
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      const statusCode = error.status || 400;
      return sendError(res, statusCode, "Signup failed", [
        createError(
          "auth",
          error.message.includes("already registered")
            ? "EMAIL_EXISTS"
            : "SIGNUP_ERROR",
          error.message
        ),
      ]);
    }

    sendSuccess(
      res,
      201,
      {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          email_confirmed: data.user?.email_confirmed_at ? true : false,
          created_at: data.user?.created_at,
        },
      },
      "Account created successfully. Please check your email for confirmation."
    );
  } catch (err) {
    sendServerError(res, "Internal server error", err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    const validationErrors = validateAuthInput(email, password);
    if (validationErrors.length > 0) {
      return sendValidationError(res, validationErrors);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return sendAuthError(res, "Invalid email or password");
    }

    sendSuccess(
      res,
      200,
      {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          email_confirmed: data.user?.email_confirmed_at ? true : false,
          last_sign_in: data.user?.last_sign_in_at,
        },
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at,
          token_type: data.session?.token_type,
        },
      },
      "Successfully signed in"
    );
  } catch (err) {
    sendServerError(res, "Internal server error", err);
  }
});

router.post("/signout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return sendError(res, 400, "Signout failed", [
        createError("auth", "SIGNOUT_ERROR", error.message),
      ]);
    }

    sendSuccess(res, 200, null, "Successfully signed out");
  } catch (err) {
    sendServerError(res, "Internal server error", err);
  }
});

router.get("/google", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.GOOGLE_REDIRECT_URL ||
          "http://localhost:4000/auth/callback",
      },
    });

    if (error) {
      return sendError(res, 400, "OAuth initialization failed", [
        createError("oauth", "OAUTH_ERROR", error.message),
      ]);
    }

    // Redirect to Google OAuth
    res.redirect(data.url);
  } catch (err) {
    sendServerError(res, "Internal server error", err);
  }
});

router.get("/callback", (req, res) => {
  try {
    const { access_token, refresh_token, error } = req.query;

    if (error) {
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/auth/error?message=${encodeURIComponent(error)}`
      );
    }

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/success`
    );
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/auth/error?message=callback_error`
    );
  }
});

export default router;
