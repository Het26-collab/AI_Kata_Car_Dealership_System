export class AppError extends Error {
  constructor(message, status = 500, details = null, errors = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.errors = errors;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error.";

  const response = {
    error: message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }
  if (err.details) {
    response.details = err.details;
  }

  if (status >= 500 && process.env.NODE_ENV !== "test") {
    console.error("[ErrorHandler]", err);
  }

  res.status(status).json(response);
}
