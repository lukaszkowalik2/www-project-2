import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiDeleteResponse, createApiItemsResponse, createApiPostResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, DeleteUserSchema, UserSchema } from "@/api/user/userModel";
import { userController } from "./userController";

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

userRouter.delete("/:id", userController.deleteUser);

// userRegistry.registerPath({
//   method: "get",
//   path: "/users/{id}",
//   tags: ["User"],
//   request: { params: GetUserSchema.shape.params },
//   responses: createApiResponse(UserSchema, "Success"),
// });

// userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);
