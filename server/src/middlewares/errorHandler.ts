import type { ErrorRequestHandler, NextFunction } from "express";
import type { Request, Response } from "express";
import AppError from "../utils/AppError.js";

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Expected errors (bad input, not found, conflict, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  // Unexpected bugs
  console.error("UNEXPECTED ERROR:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ success: false, message: "Something went wrong" });
};

export default errorHandler;
