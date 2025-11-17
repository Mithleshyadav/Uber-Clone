 module.exports.errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err); // Avoid double response

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

