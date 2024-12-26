import { StatusCodes } from "http-status-codes";
import type { z } from "zod";

import { ServiceResponseDeleteSchema, ServiceResponseItemsSchema, ServiceResponsePostSchema, ServiceResponseSingleItemSchema } from "@/common/models/serviceResponse";

export function createApiObjectResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseSingleItemSchema(schema),
        },
      },
    },
  };
}

export function createApiItemsResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseItemsSchema(schema),
        },
      },
    },
  };
}

export function createApiPostResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.CREATED) {
  return {
    [statusCode]: {
      description,
      content: { "application/json": { schema: ServiceResponsePostSchema(schema) } },
    },
  };
}

export function createApiDeleteResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: { description, content: { "application/json": { schema: ServiceResponseDeleteSchema(schema) } } },
  };
}
