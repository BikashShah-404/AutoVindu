import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { authServices } from "./auth.service.js";
import { envVariables } from "../../config/env.js";
import { BadRequestError, UnauthorizedError } from "../../utils/AppError.js";
import { verifyJWT } from "../../utils/jwt.js";
import { User } from "../../models/index.js";
import { userServices } from "../users/user.service.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authServices.register(req.body);
  res.status(201).json({
    statusCode: 201,
    message: "User Registered Successfully",
    data: user,
  });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authServices.login(
    req.body,
  );

  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: envVariables.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      statusCode: 200,
      message: "User Logged In Successfully",
      data: { user, accessToken },
    });
});

const refreshTokens = asyncHandler(async (req: Request, res: Response) => {
  const { rotatedAccessToken, rotatedRefreshToken } =
    await authServices.refresh(req.cookies.refreshToken);

  res
    .status(200)
    .cookie("refreshToken", rotatedRefreshToken, {
      httpOnly: true,
      secure: envVariables.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      statusCode: 200,
      message: "Token Refreshed Successfully",
      data: { rotatedAccessToken },
    });
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const result: boolean = await authServices.logout(req.cookies.refreshToken);
  res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: envVariables.nodeEnv === "production",
      sameSite: "lax",
    })
    .json({
      statusCode: 200,
      data: result,
      message: "Logged out successfully",
    });
});

export const authController = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
};
