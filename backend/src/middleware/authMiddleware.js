import supabase from "../lib/supabase.js";
import {
  sendAuthError,
  sendForbiddenError,
  sendServerError,
  createError,
} from "../utils/responseHelpers.js";

/**
 * Basic authentication middleware
 * Validates JWT token and adds user to req.user
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendAuthError(res, "Authorization header missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      return sendAuthError(res, "Invalid authorization format");
    }

    const token = authHeader.split(" ")[1];
    if (!token || token.trim() === "") {
      return sendAuthError(res, "Token missing");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError) {
      let errorCode = "INVALID_TOKEN";
      let message = "Invalid or expired token";

      if (userError.message.includes("expired")) {
        errorCode = "TOKEN_EXPIRED";
        message = "Token has expired";
      } else if (userError.message.includes("invalid")) {
        errorCode = "TOKEN_INVALID";
        message = "Invalid token format";
      }

      return sendAuthError(res, message, [
        createError("token", errorCode, userError.message),
      ]);
    }

    if (!user) {
      return sendAuthError(res, "User not found");
    }

    req.user = {
      id: user.id,
      email: user.email,
      email_confirmed: user.email_confirmed_at ? true : false,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
    };

    req.token = token;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    sendServerError(res, "Authentication service unavailable", error);
  }
};

/**
 * Middleware to check if user owns the resource
 * Usage: requireOwnership('user_id') - checks if req.params.user_id matches req.user.id
 */
export const requireOwnership = (paramName = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, "Authentication required");
    }

    const resourceUserId = req.params[paramName];
    if (!resourceUserId) {
      return sendForbiddenError(res, "Resource ID not provided");
    }

    if (req.user.id !== resourceUserId) {
      return sendForbiddenError(res, "Access denied", [
        createError(
          "ownership",
          "NOT_OWNER",
          "You can only access your own resources"
        ),
      ]);
    }

    next();
  };
};

// Export default as the main auth middleware
export default authenticateUser;
