import express from "express";
import supabase from "../lib/supabase.js";
import authenticateUser from "../middleware/authMiddleware.js";
import validateIdeaData, {
  validateCreateIdea,
  validateIdeaQuery,
  validateUpdateIdea,
} from "../middleware/ideaMiddleware.js";
import {
  sendSuccess,
  sendError,
  sendValidationError,
  sendAuthError,
  sendNotFoundError,
  sendServerError,
  createError,
} from "../utils/responseHelpers.js";

const router = express.Router();

// CREATE idea
router.post("/", authenticateUser, validateCreateIdea, async (req, res) => {
  try {
    const { title, tags, content } = req.body;

    const { data, error } = await supabase
      .from("ideas")
      .insert([
        {
          title,
          tags,
          content,
          user_id: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error creating idea:", error);
      return sendError(res, 400, "Unable to save idea to database", [
        createError("database", "INSERT_FAILED", error.message),
      ]);
    }

    sendSuccess(
      res,
      201,
      data,
      `Idea '${title}' has been created successfully`
    );
  } catch (error) {
    console.error("Unexpected error creating idea:", error);
    sendServerError(
      res,
      "An unexpected error occurred while creating the idea",
      error
    );
  }
});

// GET all ideas for authenticated user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error fetching ideas:", error);
      return sendError(res, 400, "Unable to retrieve ideas from database", [
        createError("database", "FETCH_FAILED", error.message),
      ]);
    }

    sendSuccess(
      res,
      200,
      data,
      `Found ${data.length} idea${data.length !== 1 ? "s" : ""}`,
      { count: data.length }
    );
  } catch (error) {
    console.error("Unexpected error fetching ideas:", error);
    sendServerError(
      res,
      "An unexpected error occurred while fetching ideas",
      error
    );
  }
});

// SEARCH/FILTER ideas
router.get("/search", authenticateUser, validateIdeaQuery, async (req, res) => {
  try {
    const { query } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendAuthError(res, "Authorization header is required");
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return sendAuthError(
        res,
        userError?.message || "Unable to authenticate user"
      );
    }

    let supabaseQuery = supabase
      .from("ideas")
      .select("*")
      .eq("user_id", user.id);

    if (query) {
      supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error("Database error fetching ideas:", error);
      return sendError(res, 400, "Unable to retrieve ideas from database", [
        createError("database", "FETCH_FAILED", error.message),
      ]);
    }

    const message =
      data.length === 0 ? "No ideas found" : "Ideas retrieved successfully";
    sendSuccess(res, 200, data, message);
  } catch (error) {
    console.error("Unexpected error searching ideas:", error);
    sendServerError(
      res,
      "An unexpected error occurred while searching ideas",
      error
    );
  }
});

// GET specific idea by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format (assuming UUID or numeric)
    if (!id || id.trim() === "") {
      return sendValidationError(res, [
        createError("id", "REQUIRED", "Idea ID is required"),
      ]);
    }

    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return sendNotFoundError(res, "Idea");
      }

      console.error("Database error fetching idea:", error);
      return sendError(res, 400, "Unable to retrieve idea from database", [
        createError("database", "FETCH_FAILED", error.message),
      ]);
    }

    sendSuccess(res, 200, data, "Idea retrieved successfully");
  } catch (error) {
    console.error("Unexpected error fetching idea:", error);
    sendServerError(
      res,
      "An unexpected error occurred while fetching the idea",
      error
    );
  }
});

// UPDATE idea by ID
router.put("/:id", authenticateUser, validateUpdateIdea, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags, content } = req.body;

    // Validate ID format
    if (!id || id.trim() === "") {
      return sendValidationError(res, [
        createError("id", "REQUIRED", "Idea ID is required"),
      ]);
    }

    const { data, error } = await supabase
      .from("ideas")
      .update({
        title,
        tags,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return sendNotFoundError(res, "Idea");
      }

      console.error("Database error updating idea:", error);
      return sendError(res, 400, "Unable to update idea in database", [
        createError("database", "UPDATE_FAILED", error.message),
      ]);
    }

    sendSuccess(
      res,
      200,
      data,
      `Idea '${data.title}' has been updated successfully`
    );
  } catch (error) {
    console.error("Unexpected error updating idea:", error);
    sendServerError(
      res,
      "An unexpected error occurred while updating the idea",
      error
    );
  }
});

// DELETE idea by ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.trim() === "") {
      return sendValidationError(res, [
        createError("id", "REQUIRED", "Idea ID is required"),
      ]);
    }

    // First check if the idea exists and belongs to the user
    const { data: existingIdea, error: fetchError } = await supabase
      .from("ideas")
      .select("id, title")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return sendNotFoundError(res, "Idea");
      }

      console.error("Database error checking idea existence:", fetchError);
      return sendError(res, 400, "Unable to verify idea existence", [
        createError("database", "FETCH_FAILED", fetchError.message),
      ]);
    }

    // Proceed with deletion
    const { error: deleteError } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (deleteError) {
      console.error("Database error deleting idea:", deleteError);
      return sendError(res, 400, "Unable to delete idea from database", [
        createError("database", "DELETE_FAILED", deleteError.message),
      ]);
    }

    sendSuccess(
      res,
      200,
      null,
      `Idea '${existingIdea.title}' has been deleted successfully`
    );
  } catch (error) {
    console.error("Unexpected error deleting idea:", error);
    sendServerError(
      res,
      "An unexpected error occurred while deleting the idea",
      error
    );
  }
});

export default router;
