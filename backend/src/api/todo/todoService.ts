import { StatusCodes } from "http-status-codes";
import { todoRepository } from "./todoRepository";
import { ServiceResponseDelete, ServiceResponseItems, ServiceResponsePost } from "@/common/models/serviceResponse";

import type { CreateTodoInput, UpdateTodoInput } from "./todoModel";

class TodoService {
  async createTodo(data: CreateTodoInput) {
    try {
      const todo = await todoRepository.create(data);
      return ServiceResponsePost.success(StatusCodes.CREATED, todo);
    } catch (error) {
      return ServiceResponsePost.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async updateTodo(id: number, data: UpdateTodoInput) {
    try {
      const todo = await todoRepository.update(id, data);
      return ServiceResponsePost.success(StatusCodes.OK, todo);
    } catch (error) {
      return ServiceResponsePost.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async deleteTodo(id: number) {
    try {
      await todoRepository.delete(id);
      return ServiceResponseDelete.success();
    } catch (error) {
      return ServiceResponseDelete.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async getTodoById(id: number) {
    try {
      const todo = await todoRepository.findById(id);
      if (!todo) {
        return ServiceResponseItems.failure(StatusCodes.NOT_FOUND, "Todo not found");
      }
      const count = await todoRepository.countTodosByUserId(todo.user_id);

      return ServiceResponseItems.success(todo, StatusCodes.OK, count);
    } catch (error) {
      return ServiceResponseItems.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async getAllTodos(params: { page: number; per_page: number }) {
    try {
      const { todos, total } = await todoRepository.findAll(params);
      return ServiceResponseItems.success(todos, StatusCodes.OK, total);
    } catch (error) {
      return ServiceResponseItems.failure(StatusCodes.BAD_REQUEST);
    }
  }

  async getTodosByUserId(userId: number) {
    try {
      const todos = await todoRepository.findByUserId(userId);
      return ServiceResponseItems.success(todos, StatusCodes.OK, todos.length);
    } catch (error) {
      return ServiceResponseItems.failure(StatusCodes.BAD_REQUEST);
    }
  }
}

export const todoService = new TodoService();
