import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/constants";
import { ServiceResponse } from "./serviceResponse";

export class ServiceResponseItems<T = null> {
  readonly success: boolean;
  readonly items: T[];
  readonly items_count: number;
  readonly status: number;
  readonly page: number;
  readonly per_page: number;
  readonly message?: string;

  private constructor(success: boolean, items: T[], status: number, items_count: number, page: number, per_page: number, message?: string) {
    this.success = success;
    this.items = items;
    this.items_count = items_count;
    this.status = status;
    this.page = page ?? DEFAULT_PAGE;
    this.per_page = per_page ?? DEFAULT_PER_PAGE;
    this.message = message;
  }

  static success<T>(items: T[], status: number = StatusCodes.OK, items_count: number, page: number = DEFAULT_PAGE, per_page: number = DEFAULT_PER_PAGE, message?: string): ServiceResponseItems<T> {
    return new ServiceResponseItems<T>(true, items, status, items_count, page, per_page, message);
  }

  static failure(status: number = StatusCodes.NOT_FOUND, message?: string): ServiceResponse {
    return ServiceResponse.failure(status, message);
  }
}

export const ServiceResponseItemsSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    items: z.array(dataSchema),
    items_count: z.number(),
    status: z.number(),
    message: z.string().optional(),
  });
