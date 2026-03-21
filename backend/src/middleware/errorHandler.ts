import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  statusCode: number;
  code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message, code: err.code });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ message, code: "INTERNAL_ERROR" });
}
