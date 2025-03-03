// imports
import mongoose from "mongoose";
import http from "http";

// error handler middleware
export function errorHandler(err, req, res, next) {
  let { statusCode, message } = err;

  // mongoose validator error message parsing and status code assigning
  if (err instanceof mongoose.Error.ValidatorError) {
    message = `${err.path.toUpperCase()}:${err.value} is invalid`;
    statusCode = 400;
  }

  // send error response
  res.status(statusCode || 500).json({
    success: false,
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
