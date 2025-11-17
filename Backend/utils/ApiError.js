class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
      this.errors = errors;
      if (stack) {
          this.stack = stack;
      } else {
          Error.captureStackTrace(this, this.constructor);
      }
  }

  static badRequest(message = "Bad Request", errors = []) {
      return new ApiError(400, message, errors);
  }

  static notFound(message = "Not Found") {
      return new ApiError(404, message);
  }

  static internal(message = "Internal Server Error", errors = []) {
      return new ApiError(500, message, errors);
  }
}

module.exports = ApiError;
