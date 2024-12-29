import { Router } from "express";
import { todoController } from "./todoController";

export const todoRouter = Router();

todoRouter.post("/", todoController.createTodo.bind(todoController));
todoRouter.put("/:id", todoController.updateTodo.bind(todoController));
todoRouter.delete("/:id", todoController.deleteTodo.bind(todoController));
todoRouter.get("/", todoController.getAllTodos.bind(todoController));
todoRouter.get("/user/:userId", todoController.getTodosByUserId.bind(todoController));
