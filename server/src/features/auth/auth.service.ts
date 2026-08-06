import { User } from "../../models/index.js";
import { Op } from "sequelize";
import { ConflictError, UnauthorizedError } from "../../utils/AppError.js";
import type { createUserInput, loginUserInput } from "./auth.validator.js";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import { resolve } from "dns";

const register = async (data: createUserInput): Promise<User> => {
  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser)
    throw new ConflictError("Email already exists", "EMAIL_EXISTS");

  return User.create(data);
};

const login = async (
  data: loginUserInput,
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: data.identifier }, { username: data.identifier }],
    },
  });
  if (!user)
    throw new UnauthorizedError("Invalid Credentials", "INVALID_CREDENTIALS");
  const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
  if (!isPasswordCorrect)
    throw new UnauthorizedError("Invalid Credentials", "INVALID_CREDENTIALS");

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
    role: user.role,
  });
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const authServices = {
  register,
  login,
};
