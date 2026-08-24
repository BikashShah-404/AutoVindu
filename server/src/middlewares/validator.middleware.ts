import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { BadRequestError } from "../utils/AppError.js";

const parseOrThrow = (schema: z.ZodSchema, payload: unknown) => {
  const result = schema.safeParse(payload);
  if (!result.success)
    throw new BadRequestError(
      "Validation Failed",
      "VALIDATION_ERROR",
      result.error.flatten().fieldErrors,
    );

  return result.data;
};

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedData = parseOrThrow(schema, req.body);
    req.body = parsedData;
    next();
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedData = parseOrThrow(schema, req.params);
    req.params = parsedData as Record<string, string>;
    next();
  };
};
