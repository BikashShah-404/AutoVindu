import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { BadRequestError } from "../utils/AppError.js";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success)
      throw new BadRequestError(
        "Validation Failed",
        "VALIDATION_ERROR",
        result.error.flatten().fieldErrors,
      );

    req.body = result.data;
    next();
  };
};
