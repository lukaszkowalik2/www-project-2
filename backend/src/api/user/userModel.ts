import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string().optional(),
  last_login: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  password: z.string(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  bio: z.string().max(500).optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  password: z.string().min(6).max(100).optional(),
});

export const GetUsersSchema = z.object({
  per_page: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional(),
  search: z.string().optional(),
});

export const DeleteUserSchema = z.object({
  id: z.number().positive(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type GetUsers = z.infer<typeof GetUsersSchema>;
export type DeleteUser = z.infer<typeof DeleteUserSchema>;
