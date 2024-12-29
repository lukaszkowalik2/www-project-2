import { z } from "zod";

export const TodoStatus = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
type TodoStatus = z.infer<typeof TodoStatus>;

export const CreateTodoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: TodoStatus.optional(),
  due_date: z.string().datetime().optional(),
  user_id: z.number().int().positive(),
});

export const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: TodoStatus.optional(),
  due_date: z.string().datetime().optional(),
});

export const GetTodoSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
