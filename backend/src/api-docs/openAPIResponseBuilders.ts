import { StatusCodes } from "http-status-codes";

import { ServiceResponseAuthSchema, ServiceResponseDeleteSchema, ServiceResponseItemsSchema, ServiceResponsePostSchema, ServiceResponsePutSchema, ServiceResponseSingleItemSchema } from "@/common/models/serviceResponse";

import type { z } from "zod";

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

export function createApiAuthResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: { description, content: { "application/json": { schema: ServiceResponseAuthSchema(schema) } } },
  };
}

export function createApiPutResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: { description, content: { "application/json": { schema: ServiceResponsePutSchema(schema) } } },
  };
}
