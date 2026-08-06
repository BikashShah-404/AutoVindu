import { Router } from "express";

import { API_INDEX } from "../constants.js";

// Imported Routes:
import userRouter from "../features/users/user.route.js";
import authRouter from "../features/auth/auth.routes.js";

const appRouter = Router();

// authRoutes:
appRouter.use(`${API_INDEX}/auth`, authRouter);
// userRoutes:
appRouter.use(`${API_INDEX}/users`, userRouter);

export default appRouter;
