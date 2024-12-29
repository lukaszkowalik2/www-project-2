import { z } from "zod";

export const HealthCheckSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  message: z.string(),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;
