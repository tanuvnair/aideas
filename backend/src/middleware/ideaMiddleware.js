import { sendValidationError, createError } from "../utils/responseHelpers.js";

/**
 * Validates idea data for create and update operations
 * Only validates user-controllable fields: title and tags
 * @param {boolean} isUpdate - Whether this is an update operation (makes some fields optional)
 */
const validateIdeaData = (isUpdate = false) => {
  return (req, res, next) => {
    const { title, tags } = req.body;
    const errors = [];

    // Filter out any non-allowed fields for security
    const allowedFields = ["title", "tags", "content"];
    const bodyKeys = Object.keys(req.body);
    const invalidFields = bodyKeys.filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
      errors.push(
        createError(
          "fields",
          "INVALID_FIELDS",
          `Invalid fields: ${invalidFields.join(
            ", "
          )}. Only title and tags are allowed.`
        )
      );
    }

    // Title validation - required for create, optional for update
    if (!isUpdate) {
      // Required for create
      if (!title || typeof title !== "string" || !title.trim()) {
        errors.push(createError("title", "REQUIRED", "Title is required"));
      }
    }

    // Validate title if provided (for both create and update)
    if (title !== undefined) {
      if (typeof title !== "string") {
        errors.push(
          createError("title", "INVALID_TYPE", "Title must be a string")
        );
      } else if (title.trim().length < 3) {
        errors.push(
          createError(
            "title",
            "TOO_SHORT",
            "Title must be at least 3 characters long"
          )
        );
      } else if (title.trim().length > 255) {
        errors.push(
          createError("title", "TOO_LONG", "Title cannot exceed 255 characters")
        );
      }
    }

    // Tags validation (optional for both create and update)
    if (tags !== undefined) {
      if (tags === null) {
        // Allow null tags (will be stored as null in database)
        req.body.tags = null;
      } else if (!Array.isArray(tags)) {
        errors.push(
          createError("tags", "INVALID_TYPE", "Tags must be an array or null")
        );
      } else if (tags.length > 20) {
        errors.push(
          createError("tags", "TOO_MANY", "Cannot have more than 20 tags")
        );
      } else {
        // Validate each tag
        const validTags = [];
        tags.forEach((tag, index) => {
          if (typeof tag !== "string") {
            errors.push(
              createError(
                `tags[${index}]`,
                "INVALID_TYPE",
                `Tag at index ${index} must be a string`
              )
            );
          } else if (!tag.trim()) {
            // Skip empty tags (don't add to validTags)
            return;
          } else if (tag.trim().length > 50) {
            errors.push(
              createError(
                `tags[${index}]`,
                "TAG_TOO_LONG",
                `Tag "${tag}" cannot exceed 50 characters`
              )
            );
          } else {
            validTags.push(tag.trim().toLowerCase()); // Normalize tags
          }
        });

        // Remove duplicates and update req.body
        req.body.tags = [...new Set(validTags)];
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    // Sanitize and normalize data
    if (title !== undefined) {
      req.body.title = title.trim();
    }

    next();
  };
};

/**
 * Basic validation for idea creation (all required fields)
 */
export const validateCreateIdea = validateIdeaData(false);

/**
 * Validation for idea updates (partial data allowed)
 */
export const validateUpdateIdea = validateIdeaData(true);

/**
 * Validation for idea search/filter parameters
 */
export const validateIdeaQuery = (req, res, next) => {
  const { page, limit, search, tag } = req.query;
  const errors = [];

  // Page validation
  if (page !== undefined) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push(
        createError("page", "INVALID_VALUE", "Page must be a positive integer")
      );
    } else if (pageNum > 1000) {
      errors.push(
        createError("page", "TOO_LARGE", "Page number cannot exceed 1000")
      );
    }
  }

  // Limit validation
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1) {
      errors.push(
        createError(
          "limit",
          "INVALID_VALUE",
          "Limit must be a positive integer"
        )
      );
    } else if (limitNum > 100) {
      errors.push(createError("limit", "TOO_LARGE", "Limit cannot exceed 100"));
    }
  }

  // Search validation (searches in title and content)
  if (search !== undefined) {
    if (typeof search !== "string") {
      errors.push(
        createError("search", "INVALID_TYPE", "Search term must be a string")
      );
    } else if (search.trim().length < 2) {
      errors.push(
        createError(
          "search",
          "TOO_SHORT",
          "Search term must be at least 2 characters long"
        )
      );
    } else if (search.trim().length > 100) {
      errors.push(
        createError(
          "search",
          "TOO_LONG",
          "Search term cannot exceed 100 characters"
        )
      );
    }
  }

  // Tag filter validation
  if (tag !== undefined) {
    if (typeof tag !== "string") {
      errors.push(
        createError("tag", "INVALID_TYPE", "Tag filter must be a string")
      );
    } else if (tag.trim().length < 1) {
      errors.push(
        createError("tag", "TOO_SHORT", "Tag filter cannot be empty")
      );
    } else if (tag.trim().length > 50) {
      errors.push(
        createError("tag", "TOO_LONG", "Tag filter cannot exceed 50 characters")
      );
    }
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  // Normalize query parameters
  if (page) req.query.page = parseInt(page);
  if (limit) req.query.limit = parseInt(limit);
  if (search) req.query.search = search.trim();
  if (tag) req.query.tag = tag.trim().toLowerCase();

  next();
};

// Export the basic validation as default for backward compatibility
export default validateCreateIdea;
