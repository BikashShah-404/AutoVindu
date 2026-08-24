import Router from "express";
import { validateBody } from "../../middlewares/validator.middleware.js";
import { createUserSchema, loginUserSchema } from "./auth.validator.js";
import { authController } from "./auth.controller.js";

const router = Router();

router
  .route("/create")
  .post(validateBody(createUserSchema), authController.registerUser);

router
  .route("/login")
  .post(validateBody(loginUserSchema), authController.loginUser);

router.route("/refresh").post(authController.refreshTokens);

router.route("/logout").post(authController.logoutUser);

export default router;
