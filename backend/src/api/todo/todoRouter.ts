import { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { todoController } from "./todoController";
import { GetTodoSchema, TodoSchema } from "./todoModel";
import { createApiItemsResponse, createApiObjectResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/auth";

// todoRouter.delete("/:id", todoController.deleteTodo.bind(todoController));

export const todoRegistry = new OpenAPIRegistry();
export const todoRouter: Router = Router();

todoRegistry.register("Todo", GetTodoSchema);

todoRegistry.registerPath({
  method: "get",
  path: "/todos/{id}",
  tags: ["Todo"],
  responses: createApiItemsResponse(z.array(TodoSchema), "Success"),
});

todoRouter.get("/:id", authenticateToken, todoController.getAllTodos);

todoRegistry.registerPath({
  method: "post",
  path: "/todos/{id}",
  tags: ["Todo"],
  responses: createApiObjectResponse(TodoSchema, "Success"),
});

todoRouter.post("/:id", authenticateToken, todoController.createTodo);

todoRegistry.registerPath({
  method: "put",
  path: "/todos/{id}",
  tags: ["Todo"],
  responses: createApiObjectResponse(TodoSchema, "Success"),
});

todoRouter.put("/:id", authenticateToken, todoController.updateTodo);

todoRegistry.registerPath({
  method: "delete",
  path: "/todos/{id}",
  tags: ["Todo"],
  responses: createApiObjectResponse(TodoSchema, "Success"),
});

todoRouter.delete("/:id", authenticateToken, todoController.deleteTodo);
