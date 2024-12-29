import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ServiceResponse } from "./serviceResponse";

export class ServiceResponseAuth {
  readonly success: boolean;
  readonly token: string;
  readonly status: number;
  readonly message?: string;

  private constructor(success: boolean, token: string, status: number, message?: string) {
    this.success = success;
    this.token = token;
    this.status = status;
    this.message = message;
  }

  static success(token: string, status: number = StatusCodes.OK, message?: string) {
    return new ServiceResponseAuth(true, token, status, message);
  }

  static failure(status: number = StatusCodes.UNAUTHORIZED, message?: string): ServiceResponse {
    return ServiceResponse.failure(status, message);
  }
}

export const ServiceResponseAuthSchema = z.object({
  success: z.boolean(),
  token: z.string(),
  status: z.number(),
  message: z.string().optional(),
});
