import type { Server } from "http";

import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";

let server: Server;

const main = () => {
  server = app.listen(env.PORT, () => {
    logger.info("Server started successfully", {
      url: `http://localhost:${env.PORT}`,
      environment: env.NODE_ENV,
    });
  });
};

main();

const shutdown = (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server`);

  const forceExitTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();
  server.close(() => {
    logger.info("HTTP server closed");
    clearTimeout(forceExitTimer);
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logger.error("UNHANDLED REJECTION!!! Shutting down...", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
