import { z } from "zod";

export const TodoStatus = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
export type TodoStatus = z.infer<typeof TodoStatus>;

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
  due_date?: string;
  user_id: number;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: TodoStatus;
  due_date?: string;
}
