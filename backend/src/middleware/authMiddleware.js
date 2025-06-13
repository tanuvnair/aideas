import supabase from "../lib/supabase.js";

// Middleware to extract and validate auth token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header missing",
        message: "Please provide a valid authorization token",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format",
        message: "Authorization header must be in format: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token missing",
        message: "No token provided in authorization header",
      });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid or expired token",
        details: userError.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "User not found",
        message: "No user associated with this token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred during authentication",
    });
  }
};

export default authenticateUser;
