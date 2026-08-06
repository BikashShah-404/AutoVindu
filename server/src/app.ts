import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVariables } from "./config/env.js";

import type { Request, Response } from "express";

import errorHandler from "./middlewares/errorHandler.js";

import appRouter from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: envVariables.clientURL,
    credentials: true,
  }),
);

app.use("/", appRouter);
app.use(errorHandler);

// app.use((req, res) => {
//   return res.json("Not found");
// });

export default app;
