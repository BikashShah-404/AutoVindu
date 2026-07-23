class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string | undefined;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(
    message = "Bad Request",
    code = "BAD_REQUEST",
    details?: unknown,
  ) {
    super(message, 400, code, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized Request", code = "UNAUTHORIZED") {
    super(message, 401, code);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden Request", code = "Forbidden") {
    super(message, 403, code);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found", code = "NOT_FOUND") {
    super(message, 404, code);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict Found", code = "CONFLICT") {
    super(message, 409, code);
  }
}

export default AppError;

export {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
