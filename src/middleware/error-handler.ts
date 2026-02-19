import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "../errors/Error.js";
import type { ErrorData } from "../types/error.types.js";
import logger from "../config/logger.js";
import { env } from "../config/env.js";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const duration = Date.now() - (res.locals.startTime || 0);

  const errorData: ErrorData = {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    duration: `${duration}ms`,
    ip: req.ip,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (err.statusCode >= 500 || !err.statusCode) {
    logger.error("Unhandled error", errorData);
  } else if (err.statusCode >= 400) {
    logger.warn("Request validation error:", errorData);
  }

  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      statusCode: err.statusCode,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
  next();
};

export default errorHandler;
