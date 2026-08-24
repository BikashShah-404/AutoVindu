import { Router } from "express";
import { userController } from "./user.controller.js";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validator.middleware.js";
import {
  authenticateUser,
  authorizeUser,
} from "../../middlewares/auth.middleware.js";
import { USER_ROLES } from "../../config/rolePermissions.js";
import { idParamsSchema } from "./user.validator.js";

const router = Router();

router.route("/")

// get a user by id:
router
  .route("/:id")
  .get(
    validateParams(idParamsSchema),
    authenticateUser,
    authorizeUser(["super_admin", "admin"]),
    userController.getAUserById,
  );

export default router;
