import { Router } from "express";
import { userController } from "./user.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";

const router = Router();

// router.route("/:id").get(userController.getAUserById)

export default router;
