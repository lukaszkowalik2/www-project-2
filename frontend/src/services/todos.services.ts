import ky from "ky";

import type { CreateTodoInput, Todo, UpdateTodoInput } from "../types/todo.js";

const API_URL = "http://localhost:8080";

export async function getAllTodos(userId: number) {
  const token = localStorage.getItem("token");

  const response = await ky.get(`${API_URL}/todos/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json<{ items: Todo[] }>();
}

export async function createTodo(userId: number, todo: CreateTodoInput) {
  const token = localStorage.getItem("token");

  return ky
    .post(`${API_URL}/todos/${userId}`, {
      json: todo,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<{ item: Todo }>();
}

export async function updateTodo(id: number, todo: UpdateTodoInput) {
  const token = localStorage.getItem("token");

  return ky
    .put(`${API_URL}/todos/${id}`, {
      json: todo,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<{ item: Todo }>();
}

export async function deleteTodo(id: number) {
  const token = localStorage.getItem("token");

  return ky
    .delete(`${API_URL}/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
}
