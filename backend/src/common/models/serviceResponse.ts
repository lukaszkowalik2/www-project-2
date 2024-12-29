import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse {
  readonly success: boolean;
  readonly status: number;
  readonly message?: string;

  private constructor(success: boolean, status: number, message?: string) {
    this.success = success;
    this.status = status;
    this.message = message;
  }

  static success(status: number = StatusCodes.OK, message?: string) {
    return new ServiceResponse(true, status, message);
  }

  static failure(status: number = StatusCodes.INTERNAL_SERVER_ERROR, message?: string) {
    return new ServiceResponse(false, status, message);
  }
}

export const ServiceResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string().optional(),
});
