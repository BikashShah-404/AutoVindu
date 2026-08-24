import { User } from "../../models/index.js";
import { BadRequestError, NotFoundError } from "../../utils/AppError.js";

const findAUserById = async (id: string) => {
  if (typeof id !== "string") throw new BadRequestError("Invalid user id");
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("The user doesn't exist");
  return user;
};

export const userServices = { findAUserById };
