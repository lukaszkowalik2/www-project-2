import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
