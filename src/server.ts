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
  logger.info(`${signal} signal recieved: closing HTTP server`);
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION!!! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
