import type { Response, Request, NextFunction } from "express";

const timingMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.locals.startTime = Date.now();
  next();
};

export default timingMiddleware;
