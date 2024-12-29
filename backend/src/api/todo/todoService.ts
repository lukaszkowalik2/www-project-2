import { StatusCodes } from "http-status-codes";
import { todoRepository } from "./todoRepository";

import type { CreateTodoInput, UpdateTodoInput } from "./todoModel";
import { ServiceResponse } from "@/common/models/serviceResponse";

class TodoService {
  async createTodo(data: CreateTodoInput) {
    try {
      const todo = await todoRepository.create(data);
      return ServiceResponse.success(StatusCodes.CREATED, todo);
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async updateTodo(id: number, data: UpdateTodoInput) {
    try {
      const todo = await todoRepository.update(id, data);
      return ServiceResponse.success(StatusCodes.OK, todo);
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async deleteTodo(id: number) {
    try {
      await todoRepository.delete(id);
      return ServiceResponse.success();
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async getTodoById(id: number) {
    try {
      const todo = await todoRepository.findById(id);
      if (!todo) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Todo not found");
      }
      const count = await todoRepository.countTodosByUserId(todo.user_id);

      return ServiceResponse.success(StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async getAllTodos(params: { page: number; per_page: number }) {
    try {
      const { todos, total } = await todoRepository.findAll(params);
      return ServiceResponse.success(StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async getTodosByUserId(userId: number) {
    try {
      const todos = await todoRepository.findByUserId(userId);
      return ServiceResponse.success(StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
    }
  }
}

export const todoService = new TodoService();
