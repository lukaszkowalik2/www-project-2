import { z } from "zod";

export const TodoStatus = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

export const CreateTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    status: TodoStatus.optional(),
    due_date: z.string().datetime().optional(),
    user_id: z.number().int().positive(),
  }),
});

export const UpdateTodoSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => !Number.isNaN(Number(val)), "ID must be numeric"),
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: TodoStatus.optional(),
    due_date: z.string().datetime().optional(),
  }),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>["body"];
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>["body"];
