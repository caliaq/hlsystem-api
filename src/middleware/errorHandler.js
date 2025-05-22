// imports
import mongoose from "mongoose";
import http from "http";
import { error } from "console";

// error handler middleware
export function errorHandler(err, req, res, next) {
  let { statusCode, message } = err;

  // mongoose validator error message parsing and status code assigning
  if (
    err instanceof mongoose.Error.ValidatorError ||
    err instanceof mongoose.Error.CastError ||
    err instanceof mongoose.Error.DocumentNotFoundError
  ) {
    message = `${err.path.toUpperCase()}:${err.value} is invalid`;
    statusCode = 400;
  }

  // send error response
  res.status(statusCode || 500).json({
    success: false,
    error: {
      name: err.name,
      message: message || "Something went wrong",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    },
    data: {
      message: message || "Something went wrong",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      code: http.STATUS_CODES[statusCode],
    },
  });

  next();
}
