import { AppError } from "./errorHandler.js";

export function validate(schema) {
  return (req, res, next) => {
    const body = req.body || {};
    const result = schema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const details = issues.map((err) => ({
        field: err.path.join(".") || "body",
        message: err.message,
      }));
      const errors = issues.map((err) => err.message);

      return next(new AppError("Validation error", 400, details, errors));
    }
    req.body = result.data;
    next();
  };
}
