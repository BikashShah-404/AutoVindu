import { Router } from "express";

import { API_INDEX } from "../constants.js";

// Imported Routes:
import userRouter from "../features/users/user.route.js";

const appRouter = Router();

// userRoutes:
appRouter.use(`${API_INDEX}/users`, userRouter);

export default appRouter;
