import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDoc } from "./openapi";

export function docsRouter() {
  const r = Router();
  r.get("/openapi.json", (_req, res) => res.json(openApiDoc));
  r.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
  return r;
}
