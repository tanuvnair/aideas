import express from "express";
import supabase from "../lib/supabase.js";

const router = express.Router();

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

// Basic validation middleware
const validateIdeaData = (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  next();
};

// CREATE idea
router.post("/", authenticateUser, validateIdeaData, async (req, res) => {
  try {
    const { title, content } = req.body;

    const { data, error } = await supabase
      .from("ideas")
      .insert([
        {
          title,
          content,
          user_id: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error creating idea:", error);
      return res.status(400).json({
        error: "Failed to create idea",
        message: "Unable to save idea to database",
        details: error.message,
      });
    }

    res.status(201).json({
      message: `Idea '${title}' has been created successfully`,
      data: data,
    });
  } catch (error) {
    console.error("Unexpected error creating idea:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while creating the idea",
    });
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
      return res.status(400).json({
        error: "Failed to fetch ideas",
        message: "Unable to retrieve ideas from database",
        details: error.message,
      });
    }

    res.status(200).json({
      message: `Found ${data.length} idea${data.length !== 1 ? "s" : ""}`,
      data: data,
      count: data.length,
    });
  } catch (error) {
    console.error("Unexpected error fetching ideas:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while fetching ideas",
    });
  }
});

// GET specific idea by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format (assuming UUID or numeric)
    if (!id || id.trim() === "") {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Idea ID is required",
      });
    }

    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          error: "Idea not found",
          message:
            "The requested idea does not exist or you don't have permission to access it",
        });
      }

      console.error("Database error fetching idea:", error);
      return res.status(400).json({
        error: "Failed to fetch idea",
        message: "Unable to retrieve idea from database",
        details: error.message,
      });
    }

    res.status(200).json({
      message: "Idea retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.error("Unexpected error fetching idea:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while fetching the idea",
    });
  }
});

// UPDATE idea by ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate ID format
    if (!id || id.trim() === "") {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Idea ID is required",
      });
    }

    const { data, error } = await supabase
      .from("ideas")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          error: "Idea not found",
          message:
            "The idea you're trying to update does not exist or you don't have permission to modify it",
        });
      }

      console.error("Database error updating idea:", error);
      return res.status(400).json({
        error: "Failed to update idea",
        message: "Unable to update idea in database",
        details: error.message,
      });
    }

    res.status(200).json({
      message: `Idea '${data.title}' has been updated successfully`,
      data: data,
    });
  } catch (error) {
    console.error("Unexpected error updating idea:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while updating the idea",
    });
  }
});

// DELETE idea by ID
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.trim() === "") {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Idea ID is required",
      });
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
        return res.status(404).json({
          error: "Idea not found",
          message:
            "The idea you're trying to delete does not exist or you don't have permission to delete it",
        });
      }

      console.error("Database error checking idea existence:", fetchError);
      return res.status(400).json({
        error: "Failed to verify idea",
        message: "Unable to verify idea existence",
        details: fetchError.message,
      });
    }

    // Proceed with deletion
    const { error: deleteError } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (deleteError) {
      console.error("Database error deleting idea:", deleteError);
      return res.status(400).json({
        error: "Failed to delete idea",
        message: "Unable to delete idea from database",
        details: deleteError.message,
      });
    }

    res.status(200).json({
      message: `Idea '${existingIdea.title}' has been deleted successfully`,
    });
  } catch (error) {
    console.error("Unexpected error deleting idea:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while deleting the idea",
    });
  }
});

export default router;
