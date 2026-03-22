import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { corsHeaders } from "./middleware/corsHeaders";
import { authRouter } from "./modules/auth/routes";
import { assignmentsRouter } from "./modules/assignments/routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  const allowedOrigins = env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

  app.use(corsHeaders(allowedOrigins));
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "backend" });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/assignments", assignmentsRouter);

  app.use(errorHandler);

  return app;
}
