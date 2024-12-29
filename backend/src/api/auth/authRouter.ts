import { Router } from "express";
import { authController } from "./authController";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { createApiPostResponse, createApiObjectResponse } from "@/api-docs/openAPIResponseBuilders";
import { LoginSchema, TokenSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = Router();

authRegistry.register("Auth", TokenSchema);

authRegistry.registerPath({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  responses: createApiPostResponse(LoginSchema, "Success"),
});

authRouter.post("/login", authController.login);

authRegistry.registerPath({
  method: "get",
  path: "/auth/health",
  tags: ["Auth"],
  responses: createApiObjectResponse(z.object({ valid: z.boolean(), user_id: z.number() }), "Success"),
});

authRouter.get("/auth/health", authController.verifyToken);
