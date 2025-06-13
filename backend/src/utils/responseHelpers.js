/**
 * Creates a standardized API response object
 * @param {boolean} success - Whether the operation was successful
 * @param {any} data - The response data (null for errors)
 * @param {string} message - Human-readable message
 * @param {Array|null} errors - Array of error objects
 * @param {Object} meta - Additional metadata
 * @returns {Object} Standardized response object
 */
export const createResponse = (
  success,
  data = null,
  message = null,
  errors = null,
  meta = {}
) => {
  return {
    success,
    data,
    message,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || "v1.0",
      request_id: meta.request_id || null,
      ...meta,
    },
  };
};

/**
 * Sends a successful response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {Object} meta - Additional metadata
 */
export const sendSuccess = (res, statusCode, data, message, meta = {}) => {
  res.status(statusCode).json(createResponse(true, data, message, null, meta));
};

/**
 * Sends an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array|null} errors - Array of detailed error objects
 * @param {Object} meta - Additional metadata
 */
export const sendError = (
  res,
  statusCode,
  message,
  errors = null,
  meta = {}
) => {
  res
    .status(statusCode)
    .json(createResponse(false, null, message, errors, meta));
};

/**
 * Creates a standardized error object
 * @param {string} field - The field that caused the error
 * @param {string} code - Error code (e.g., 'REQUIRED', 'INVALID_FORMAT')
 * @param {string} message - Human-readable error message
 * @returns {Object} Standardized error object
 */
export const createError = (field, code, message) => {
  return {
    field,
    code,
    message,
  };
};

/**
 * Sends a validation error response (400)
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {string} message - General validation message
 */
export const sendValidationError = (
  res,
  errors,
  message = "Validation failed"
) => {
  sendError(res, 400, message, errors);
};

/**
 * Sends an authentication error response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Authentication error message
 */
export const sendAuthError = (res, message = "Authentication failed") => {
  sendError(res, 401, message, [createError("auth", "UNAUTHORIZED", message)]);
};

/**
 * Sends a forbidden error response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden error message
 */
export const sendForbiddenError = (res, message = "Access denied") => {
  sendError(res, 403, message, [createError("auth", "FORBIDDEN", message)]);
};

/**
 * Sends a not found error response (404)
 * @param {Object} res - Express response object
 * @param {string} resource - The resource that was not found
 */
export const sendNotFoundError = (res, resource = "Resource") => {
  sendError(res, 404, `${resource} not found`, [
    createError("resource", "NOT_FOUND", `${resource} not found`),
  ]);
};

/**
 * Sends an internal server error response (500)
 * @param {Object} res - Express response object
 * @param {string} message - Error message (generic for security)
 * @param {Error} error - The actual error object (for logging)
 */
export const sendServerError = (
  res,
  message = "Internal server error",
  error = null
) => {
  // Log the actual error for debugging
  if (error) {
    console.error("Server Error:", error);
  }

  sendError(res, 500, message, [
    createError("server", "INTERNAL_ERROR", "An unexpected error occurred"),
  ]);
};

/**
 * Sends a paginated response with metadata
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
export const sendPaginatedResponse = (
  res,
  data,
  pagination,
  message = "Data retrieved successfully"
) => {
  sendSuccess(res, 200, data, message, { pagination });
};
