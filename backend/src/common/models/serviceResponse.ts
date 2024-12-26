import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/Constants";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

/**
 * Generic Service Response without data
 */
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

  static failure(status: number = StatusCodes.BAD_REQUEST, message?: string) {
    return new ServiceResponse(false, status, message);
  }
}

export const ServiceResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string().optional(),
});

/**
 * Service Response for Single Item
 */
export class ServiceResponseSingleItem<T = null> {
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

  static success<T>(item: T, status: number = StatusCodes.OK, message?: string) {
    return new ServiceResponseSingleItem(true, item, status, message);
  }

  static failure<T = null>(status: number = StatusCodes.NOT_FOUND, item: T | null = null, message?: string) {
    return new ServiceResponseSingleItem(false, item, status, message);
  }
}

export const ServiceResponseSingleItemSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    item: dataSchema.nullable(),
    status: z.number(),
    message: z.string().optional(),
  });

/**
 * Service Response for Multiple Items
 */
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

  static failure<T>(status: number = StatusCodes.BAD_REQUEST, message?: string): ServiceResponseItems<T> {
    return new ServiceResponseItems<T>(false, [], status, 0, DEFAULT_PAGE, DEFAULT_PER_PAGE, message);
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

/**
 * Service Response for Post Request
 */
export class ServiceResponsePost<T = null> {
  readonly success: boolean;
  readonly data: T | null;
  readonly status: number;
  readonly message?: string;

  private constructor(success: boolean, data: T | null, status: number, message?: string) {
    this.success = success;
    this.data = data;
    this.status = status;
    this.message = message;
  }

  static success<T>(data: T, status: number = StatusCodes.CREATED, message?: string) {
    return new ServiceResponsePost(true, data, status, message);
  }

  static failure<T = null>(status: number = StatusCodes.BAD_REQUEST, message?: string) {
    return new ServiceResponsePost<T>(false, null, status, message);
  }
}

export const ServiceResponsePostSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    status: z.number(),
    message: z.string().optional(),
  });

export class ServiceResponseDelete {
  readonly success: boolean;
  readonly status: number;

  private constructor(success: boolean, status: number) {
    this.success = success;
    this.status = status;
  }

  static success(status: number = StatusCodes.OK) {
    return new ServiceResponseDelete(true, status);
  }

  static failure(status: number = StatusCodes.BAD_REQUEST) {
    return new ServiceResponseDelete(false, status);
  }
}

export const ServiceResponseDeleteSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    status: z.number(),
  });
