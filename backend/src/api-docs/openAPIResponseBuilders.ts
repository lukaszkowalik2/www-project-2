import { StatusCodes } from "http-status-codes";

import { ServiceResponseItemSchema } from "@/common/models/ServiceResponseItem";
import { ServiceResponseItemsSchema } from "@/common/models/ServiceResponseItems";
import { ServiceResponseStatusSchema } from "@/common/models/ServiceResponseStatus";

import type { z } from "zod";

export function createApiObjectResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseItemSchema(schema),
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
      content: { "application/json": { schema: ServiceResponseItemSchema(schema) } },
    },
  };
}

export function createApiDeleteResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: { description, content: { "application/json": { schema: ServiceResponseStatusSchema() } } },
  };
}

export function createApiAuthResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: { description, content: { "application/json": { schema: ServiceResponseItemsSchema(schema) } } },
  };
}

export function createApiPutResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: { description, content: { "application/json": { schema: ServiceResponseItemSchema(schema) } } },
  };
}
