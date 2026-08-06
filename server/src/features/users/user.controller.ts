import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { userServices } from "./user.service.js";

const getAUserById = asyncHandler(async (req: Request, res: Response) => {
  // const user=await userServices.
});

export const userController = {
  getAUserById,
};
