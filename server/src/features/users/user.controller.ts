import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { userServices } from "./user.service.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userServices.register(req.body);
  res.status(201).json({
    statusCode: 201,
    message: "User Registered Successfully",
    data: user,
  });
});

export const userController = {
  registerUser,
};
