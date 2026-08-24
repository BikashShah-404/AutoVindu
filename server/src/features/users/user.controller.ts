import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { userServices } from "./user.service.js";
import { BadRequestError } from "../../utils/AppError.js";

const getAUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userServices.findAUserById(id as string);
  res.status(200).json({
    statusCode: 200,
    data: user,
    message: "Retrieved User Successfully",
  });
});

export const userController = {
  getAUserById,
};
