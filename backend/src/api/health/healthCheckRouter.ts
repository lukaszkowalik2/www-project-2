import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { HealthCheckSchema } from "./healthModel";
import { createApiObjectResponse } from "@/api-docs/openAPIResponseBuilders";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter = Router();

healthCheckRouter.get("/", (_req, res) => {
  res.status(StatusCodes.OK).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    message: "API is running",
  });
});

healthCheckRegistry.register("HealthCheck", HealthCheckSchema);

healthCheckRegistry.registerPath({
  method: "get",
  path: "/health",
  tags: ["Health"],
  responses: createApiObjectResponse(HealthCheckSchema, "Success"),
});
