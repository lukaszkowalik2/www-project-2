import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiDeleteResponse, createApiItemsResponse, createApiObjectResponse, createApiPostResponse, createApiPutResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, DeleteUserSchema, UpdateUserSchema, UserSchema } from "@/api/user/userModel";
import { userController } from "./userController";
import { authenticateToken } from "@/common/middleware/auth";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiItemsResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getAllUsers);

userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  responses: createApiPostResponse(CreateUserSchema, "Success"),
});

userRouter.post("/", userController.createUser);

userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  responses: createApiDeleteResponse(DeleteUserSchema, "Success"),
});

userRouter.delete("/:id", authenticateToken, userController.deleteUser);

userRegistry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  responses: createApiPutResponse(UpdateUserSchema, "Success"),
});

userRouter.put("/:id", authenticateToken, userController.updateUser);

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  responses: createApiObjectResponse(UserSchema, "Success"),
});

userRouter.get("/:id", authenticateToken, userController.getUser);
