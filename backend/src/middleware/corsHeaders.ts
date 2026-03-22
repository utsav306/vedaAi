import type { Request, Response, NextFunction } from "express";

const DEFAULT_ALLOWED_HEADERS = "Content-Type, Authorization";
const ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

export function corsHeaders(allowedOrigins: string[]) {
  const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");
  const allowedOriginsSet = new Set(allowedOrigins.map(normalizeOrigin).filter(Boolean));

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const normalizedOrigin = typeof origin === "string" ? normalizeOrigin(origin) : undefined;
    const isAllowedOrigin = typeof normalizedOrigin === "string" && allowedOriginsSet.has(normalizedOrigin);

    if (isAllowedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);

      const requestHeaders = req.headers["access-control-request-headers"];
      if (typeof requestHeaders === "string" && requestHeaders.length > 0) {
        res.setHeader("Access-Control-Allow-Headers", requestHeaders);
      } else {
        res.setHeader("Access-Control-Allow-Headers", DEFAULT_ALLOWED_HEADERS);
      }
    }

    if (req.method === "OPTIONS") {
      if (isAllowedOrigin) {
        return res.sendStatus(204);
      }
      return res.sendStatus(403);
    }

    next();
  };
}
