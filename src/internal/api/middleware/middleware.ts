import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { failure } from "../../../utility/response";
import { logger } from "../../../utility/logger";
import { randomUUID } from "crypto";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";
  if (statusCode >= 500) {
    logger.error(
      {
        method: req.method,
        url: req.originalUrl,
        status: statusCode,
        error: err.stack || err,
        correlationId: (req as any).correlationId,
      },
      "Internal Server Error",
    );
  }
  res.status(statusCode).json(failure(message, statusCode));
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.header("x-correlation-id") || randomUUID();
  res.setHeader("x-correlation-id", correlationId);

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    if (res.statusCode == 200) {
      logger.info({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${durationMs.toFixed(2)} ms`,
        correlationId,
      });
    } else {
      logger.warn({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${durationMs.toFixed(2)} ms`,
        correlationId,
      });
    }
  });
  (req as any).correlationId = correlationId;
  next();
}
