import { z } from "zod";

export type LoginInput = z.infer<typeof LoginSchema>;
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type TokenOutput = z.infer<typeof TokenSchema>;
export const TokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});
