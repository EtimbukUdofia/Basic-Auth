import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

import { env } from "./env.js";

const isProduction = env.NODE_ENV === "production";
const isDevelopment = !isProduction;

// Custom format for development
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? JSON.stringify(meta, null, 2)
      : "";
    return `${timestamp} [${level}]: ${message}${metaStr ? ` ${metaStr}` : ""}`;
  }),
);

// Custom format for production (JSON)
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }),
);

// Configure transports based on environment
const getTransports = () => {
  const transports = [];

  if (isDevelopment) {
    // Console transport for development
    transports.push(
      new winston.transports.Console({
        format: devFormat,
        level: env.LOG_LEVEL,
      }),
    );
  } else if (isProduction) {
    // Console transport with JSON format for production (for container logs)
    transports.push(
      new winston.transports.Console({
        format: prodFormat,
        level: env.LOG_LEVEL,
      }),
    );

    // Error log file rotation (production)
    transports.push(
      new DailyRotateFile({
        filename: path.join(env.LOG_DIR, "error-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        level: "error",
        format: prodFormat,
        maxSize: "20m",
        maxFiles: "14d",
        auditFile: path.join(env.LOG_DIR, ".audit-error.json"),
        utc: true,
      }),
    );

    // Combined log file rotation (production)
    transports.push(
      new DailyRotateFile({
        filename: path.join(env.LOG_DIR, "combined-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        level: "info",
        format: prodFormat,
        maxSize: "20m",
        maxFiles: "30d",
        auditFile: path.join(env.LOG_DIR, ".audit-combined.json"),
        utc: true,
      }),
    );
  }

  return transports;
};

// Create logger instance
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports: getTransports(),
  exitOnError: false, // Don't exit on unhandled exceptions
  defaultMeta: {
    environment: env.NODE_ENV,
  },
});

// Handle uncaught exceptions
if (isProduction) {
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: path.join(env.LOG_DIR, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      format: prodFormat,
      maxSize: "20m",
      maxFiles: "14d",
      utc: true,
    }),
  );
} else {
  logger.rejections.handle(
    new winston.transports.Console({ format: devFormat }),
  );
}

// Handle unhandled rejections
if (isProduction) {
  logger.rejections.handle(
    new DailyRotateFile({
      filename: path.join(env.LOG_DIR, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      format: prodFormat,
      maxSize: "20m",
      maxFiles: "14d",
      utc: true,
    }),
  );
} else {
  logger.rejections.handle(
    new winston.transports.Console({ format: devFormat }),
  );
}

export default logger;
