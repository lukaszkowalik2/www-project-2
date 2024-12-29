import { StatusCodes } from "http-status-codes";
import { todoRepository } from "./todoRepository";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { ServiceResponseItems } from "@/common/models/ServiceResponseItems";
import { ServiceResponseItem } from "@/common/models/ServiceResponseItem";

import type { CreateTodoInput, GetTodoInput, UpdateTodoInput } from "./todoModel";

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
      return ServiceResponseItem.success(todo, StatusCodes.OK, "Todo updated successfully");
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

  // async getTodoById(id: number) {
  //   try {
  //     const todo = await todoRepository.findById(id);
  //     if (!todo) {
  //       return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Todo not found");
  //     }
  //     const count = await todoRepository.countTodosByUserId(todo.user_id);

  //     return ServiceResponse.success(StatusCodes.OK);
  //   } catch (error) {
  //     return ServiceResponse.failure(StatusCodes.BAD_REQUEST);
  //   }
  // }

  async getAllTodos(params: GetTodoInput) {
    try {
      const { todos, total } = await todoRepository.findAllForUser(params);
      return ServiceResponseItems.success(todos, StatusCodes.OK, total);
    } catch (error) {
      return ServiceResponseItems.failure(StatusCodes.BAD_REQUEST);
    }
  }
}

export const todoService = new TodoService();
