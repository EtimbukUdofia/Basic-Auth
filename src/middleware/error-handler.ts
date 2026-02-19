import type { NextFunction, Request, Response } from "express";
import type { ErrorData } from "../types/error.types.js";
import logger from "../config/logger.js";
import { env } from "../config/env.js";

export const errorHandler = (
  err: Error & { statusCode: number },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const duration = res.locals.startTime
    ? Date.now() - res.locals.startTime
    : undefined;

  const errorData: ErrorData = {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    duration: duration != null ? `${duration}ms` : "N/A",
    ip: req.ip,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (err.statusCode >= 500 || !err.statusCode) {
    logger.error("Unhandled error:", errorData);
  } else if (err.statusCode >= 400) {
    logger.error("Request validation error:", errorData);
  }

  res.status(err.statusCode || 500).json({
    error: {
      message: errorData.message,
      statusCode: errorData.statusCode,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export default errorHandler;
