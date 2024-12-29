import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ServiceResponse } from "./serviceResponse";

export class ServiceResponseItem<T = null> {
  readonly success: boolean;
  readonly item: T | null;
  readonly status: number;
  readonly message?: string;

  private constructor(success: boolean, item: T | null, status: number, message?: string) {
    this.success = success;
    this.item = item;
    this.status = status;
    this.message = message;
  }

  static success<T>(item: T, status: number = StatusCodes.OK, message?: string): ServiceResponseItem<T> {
    return new ServiceResponseItem<T>(true, item, status, message);
  }
  static failure(status: number = StatusCodes.NOT_FOUND, message?: string): ServiceResponse {
    return ServiceResponse.failure(status, message);
  }
}

export const ServiceResponseItemSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    item: dataSchema.nullable(),
    status: z.number(),
    message: z.string().optional(),
  });
