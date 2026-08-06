import Router from "express";
import { validate } from "../../middlewares/validator.middleware.js";
import { createUserSchema, loginUserSchema } from "./auth.validator.js";
import { authController } from "./auth.controller.js";

const router = Router();

router
  .route("/create")
  .post(validate(createUserSchema), authController.registerUser);
router
  .route("/login")
  .post(validate(loginUserSchema), authController.loginUser);

export default router;
