export type ErrorData = {
  message: string;
  statusCode: number;
  path: string;
  method: string;
  stack?: string | undefined;
  duration: string;
  ip: string | undefined;
};
