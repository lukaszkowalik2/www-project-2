import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { todoService } from "./todoService";
import { CreateTodoInput, CreateTodoSchema, DeleteTodoSchema, GetTodoSchema, UpdateTodoSchema } from "./todoModel";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/constants";
import { logger } from "@/server";
// import { ServiceResponse } from "@/common/models/serviceResponse";
import { ServiceResponseItems } from "@/common/models/ServiceResponseItems";
import { ServiceResponseItem } from "@/common/models/ServiceResponseItem";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { todoRepository } from "./todoRepository";

class TodoController {
  async createTodo(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
          status: StatusCodes.UNAUTHORIZED,
        });
      }
      const params: CreateTodoInput = {
        title: req.body.title,
        description: req.body.description,
        due_date: req.body.due_date,
        user_id: req.user.userId,
        status: req.body.status,
      };

      const parsedParams = CreateTodoSchema.parse(params);
      if (req.user?.userId !== parsedParams.user_id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to delete this user",
          status: StatusCodes.FORBIDDEN,
        });
      }
      const todo = await todoService.createTodo(parsedParams);
      res.status(todo.status).json(todo);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponseItem.failure(StatusCodes.BAD_REQUEST, "Failed to create todo");
      res.status(failed.status).json(failed);
    }
  }

  async updateTodo(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const savedTodo = await todoRepository.findById(id);
      if (req.user?.userId !== savedTodo?.user_id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to update this todo",
          status: StatusCodes.FORBIDDEN,
        });
      }
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
      const id = Number(req.params.id);
      const savedTodo = await todoRepository.findById(id);
      if (req.user?.userId !== savedTodo?.user_id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to delete this todo",
          status: StatusCodes.FORBIDDEN,
        });
      }
      const params = DeleteTodoSchema.parse({ id: id });
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
        id: Number(req.params.id),
      };
      const parsedParams = GetTodoSchema.parse(params);
      if (req.user?.userId !== params.id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to delete this user",
          status: StatusCodes.FORBIDDEN,
        });
      }
      const todos = await todoService.getAllTodos(parsedParams);
      res.json(todos);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponseItems.failure(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch todos");
      res.status(failed.status).json(failed);
    }
  }
}

export const todoController = new TodoController();
