import ky from "ky";

import type { CreateTodoInput, Todo, UpdateTodoInput } from "../types/todo.js";

export async function getAllTodos(userId: number) {
  const token = localStorage.getItem("token");

  const response = await ky.get(`${import.meta.env.VITE_API_URL}/todos/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json<{ items: Todo[] }>();
}

export async function createTodo(userId: number, todo: CreateTodoInput) {
  const token = localStorage.getItem("token");

  return ky
    .post(`${import.meta.env.VITE_API_URL}/todos/${userId}`, {
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
    .put(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
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
    .delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
}
