import dotenv from "dotenv";

dotenv.config();

type Environment = {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: "production" | "development" | (string & {});
  LOG_LEVEL: "debug" | "info" | "error" | (string & {});
  LOG_DIR: string;
};

if (process.env.DATABASE_URL === undefined) {
  throw new Error("Database Url is required");
}

export const env: Environment = {
  PORT: Number.parseInt(process.env.PORT as string) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_DIR: process.env.LOG_DIR || "./logs",
};
