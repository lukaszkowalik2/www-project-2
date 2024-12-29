import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "./serviceResponse";

export class ServiceResponseStatus {
  readonly success: boolean;
  readonly status: number;

  private constructor(success: boolean, status: number) {
    this.success = success;
    this.status = status;
  }

  static success(status: number = StatusCodes.OK) {
    return new ServiceResponseStatus(true, status);
  }

  static failure(status: number = StatusCodes.NOT_FOUND, message?: string): ServiceResponse {
    return ServiceResponse.failure(status, message);
  }
}

export const ServiceResponseStatusSchema = () =>
  z.object({
    success: z.boolean(),
    status: z.number(),
  });
