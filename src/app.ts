import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import requestLogger from "./middleware/request-logger.js";
import errorHandler from "./middleware/error-handler.js";
import timingMiddleware from "./middleware/error-timer.js";

const app = express();

app.use(timingMiddleware);
app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("hello");
});

app.use(errorHandler);

export default app;
