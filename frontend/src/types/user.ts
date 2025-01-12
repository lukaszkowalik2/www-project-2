import { z } from "zod";

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

export type User = z.infer<typeof UserSchema>;
