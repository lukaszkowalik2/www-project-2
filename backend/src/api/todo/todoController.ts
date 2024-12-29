import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { todoService } from "./todoService";
import { CreateTodoSchema, GetTodoSchema, UpdateTodoSchema } from "./todoModel";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/constants";
import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { ServiceResponseItems } from "@/common/models/ServiceResponseItems";

class TodoController {
  async createTodo(req: Request, res: Response) {
    try {
      const body = CreateTodoSchema.parse(req.body);
      const todo = await todoService.createTodo(body);
      res.status(todo.status).json(todo);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponse.failure(StatusCodes.BAD_REQUEST, "Failed to create todo");
      res.status(failed.status).json(failed);
    }
  }

  async updateTodo(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const body = UpdateTodoSchema.parse(req.body);
      const todo = await todoService.updateTodo(id, body);
      res.status(todo.status).json(todo);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponse.failure(StatusCodes.BAD_REQUEST, "Failed to update todo");
      res.status(failed.status).json(failed);
    }
  }

  async deleteTodo(req: Request, res: Response) {
    try {
      const params = GetTodoSchema.parse({ id: Number(req.params.id) });
      const todo = await todoService.deleteTodo(params.id);
      res.status(todo.status).json(todo);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponse.failure(StatusCodes.BAD_REQUEST, "Failed to delete todo");
      res.status(failed.status).json(failed);
    }
  }

  async getAllTodos(req: Request, res: Response) {
    try {
      const params = {
        per_page: Number(req.query.per_page ?? DEFAULT_PER_PAGE),
        page: Number(req.query.page ?? DEFAULT_PAGE),
      };
      const todos = await todoService.getAllTodos(params);
      res.json(todos);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponseItems.failure(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch todos");
      res.status(failed.status).json(failed);
    }
  }

  async getTodosByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const todos = await todoService.getTodosByUserId(userId);
      res.json(todos);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponseItems.failure(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch user todos");
      res.status(failed.status).json(failed);
    }
  }
}

export const todoController = new TodoController();
