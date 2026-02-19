import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";

const main = () => {
  app.listen(env.PORT, () => {
    logger.info("Server started successfully", {
      url: `http://localhost:${env.PORT}`,
      environment: env.NODE_ENV,
    });
  });
};

main();

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION!!! Shutting down...");
  console.error(err.name, err.message);
  process.exit(0);
});
