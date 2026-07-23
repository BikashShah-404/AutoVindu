import { Router } from "express";
import { userController } from "./user.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";
import { createUserSchema } from "./user.validator.js";

const router = Router();

router
  .route("/create")
  .post(validate(createUserSchema), userController.registerUser);

export default router;
