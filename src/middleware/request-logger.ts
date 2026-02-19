import type { Request, Response, NextFunction } from "express";

import logger from "../config/logger.js";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Listen for when response is finished
  res.on("finish", () => {
    const duration = res.locals.startTime
      ? Date.now() - res.locals.startTime
      : undefined;

    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: duration != null ? `${duration}ms` : "N/A",
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    // Log based on status code
    if (res.statusCode >= 200 && res.statusCode < 400) {
      logger.info("Request completed", logData);
    }
  });

  next();
};

export default requestLogger;
