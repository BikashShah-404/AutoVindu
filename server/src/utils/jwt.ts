import jwt from "jsonwebtoken";
import { privateKey, publicKey } from "./loadKeys.js";
import type { USER_ROLES_TYPE } from "../config/rolePermissions.js";
import { envVariables } from "../config/env.js";
import { UnauthorizedError } from "./AppError.js";

export interface JWTPayload {
  userId: string;
  role: USER_ROLES_TYPE;
  type: "access" | "refresh";
}

export const signAccessToken = (payload: Omit<JWTPayload, "type">) => {
  return jwt.sign({ ...payload, type: "access" }, privateKey, {
    algorithm: "RS256",
    expiresIn: envVariables.jwt.access.expiresIn,
  });
};

export const signRefreshToken = (payload: Omit<JWTPayload, "type">) => {
  return jwt.sign({ ...payload, type: "refresh" }, privateKey, {
    algorithm: "RS256",
    expiresIn: envVariables.jwt.refresh.expiresIn,
  });
};

export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as JWTPayload;
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
