import { NextFunction, Request, Response } from "express";
import { HttpError } from "./errorHandler";
import { verifyAccessToken } from "../services/jwt";

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
    email: string;
  };
};

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new HttpError(401, "Missing bearer token", "AUTH_REQUIRED");
  }

  const payload = verifyAccessToken(token);
  req.auth = { userId: payload.userId, email: payload.email };
  next();
}
