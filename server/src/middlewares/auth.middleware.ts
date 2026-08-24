import type { Request, Response, NextFunction } from "express";
import AppError, {
  ForbiddenError,
  UnauthorizedError,
} from "../utils/AppError.js";
import { verifyJWT, type JWTPayload } from "../utils/jwt.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { USER_ROLES_TYPE } from "../config/rolePermissions.js";
import { User } from "../models/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: USER_ROLES_TYPE;
      };
    }
  }
}

export const authenticateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    // Checking if the token is present and if it starts with proper format or not:
    if (!authHeader?.startsWith("Bearer "))
      throw new UnauthorizedError("Access Token is required.");

    // If token present check , verify it :
    const token = authHeader?.split(" ")[1];
    if (!token) throw new UnauthorizedError("Access Token is required");

    // Checking the type of the token:
    const decodedToken: JWTPayload = verifyJWT(token);
    if (decodedToken.type !== "access")
      throw new UnauthorizedError("Invalid Token Type");

    const user = await User.findByPk(decodedToken.userId);
    if (!user) throw new UnauthorizedError("The user no longer exists");

    req.user = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  },
);

export const authorizeUser = (roles: readonly USER_ROLES_TYPE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("Not Authorized"));
    }
    next();
  };
};
