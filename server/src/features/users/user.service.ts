import { User } from "../../models/index.js";
import { ConflictError } from "../../utils/AppError.js";
import type { createUserInput } from "./user.validator.js";

const register = async (data: createUserInput): Promise<User> => {
  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser)
    throw new ConflictError("Email already exists", "EMAIL_EXISTS");

  return User.create(data);
};

export const userServices = {
  register,
};
