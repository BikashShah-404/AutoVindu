import { User } from "../../models/index.js";
import { Op } from "sequelize";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../utils/AppError.js";
import type { createUserInput, loginUserInput } from "./auth.validator.js";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyJWT,
  type JWTPayload,
} from "../../utils/jwt.js";
import { envVariables } from "../../config/env.js";

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
  user.refreshToken = await bcrypt.hash(refreshToken, envVariables.hashSalt);
  await user.save();

  return { user, accessToken, refreshToken };
};

const refresh = async (refreshToken: string) => {
  if (!refreshToken) throw new UnauthorizedError("Refresh Token not found");

  const decodedToken: JWTPayload = verifyJWT(refreshToken);
  // If the token is expired or something
  if (decodedToken.type !== "refresh")
    throw new UnauthorizedError("Invalid token type");

  const user = await User.findByPk(decodedToken.userId);
  if (!user || !user.refreshToken)
    throw new UnauthorizedError("Invalid refresh token");

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) throw new UnauthorizedError("Invalid refresh token");

  const rotatedAccessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const rotatedRefreshToken = signRefreshToken({
    userId: user.id,
    role: user.role,
  });
  user.refreshToken = await bcrypt.hash(
    rotatedRefreshToken,
    envVariables.hashSalt,
  );
  await user.save();

  return { rotatedAccessToken, rotatedRefreshToken };
};

const logout = async (refreshToken?: string) => {
  // NO token , silent success , false as an indication of no token but slient success.
  if (!refreshToken) return false;

  // SO basically we will tracking the unauthorized error from the refresh and if it occurs we will logout, and if logout too start checking if the token is valid or not and start throwng exception, then we won't be able to logout, and hence had do provide a separate try catch block , here to silently pass even if expired refreshToken was provided,than the default one upper level try catch inside the verifyJWT to throw invalid or expired token error.
  let decodedToken: JWTPayload;
  try {
    decodedToken = verifyJWT(refreshToken);
  } catch (error) {
    return false;
  }

  const user = await User.findByPk(decodedToken.userId);
  if (!user || !user.refreshToken) return false;

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) return false;

  user.refreshToken = null;
  await user.save();
  return true;
};

export const authServices = {
  register,
  login,
  refresh,
  logout,
};
