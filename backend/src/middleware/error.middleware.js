const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;

    message = `${Object.keys(err.keyValue).join(", ")} already exists`;
  }

  console.error(
    `[${statusCode}] ${message}`,
    process.env.NODE_ENV === "development" ? err.stack : "",
  );

  res.status(statusCode).json({
    success: false,
    message,

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
