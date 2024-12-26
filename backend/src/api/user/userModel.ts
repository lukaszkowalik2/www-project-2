import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type GetUsers = z.infer<typeof GetUsersSchema>;

export const GetUsersSchema = z.object({
  per_page: z.number().optional(),
  page: z.number().optional(),
});

export type DeleteUser = z.infer<typeof DeleteUserSchema>;

export const DeleteUserSchema = z.object({
  id: z.number(),
});
