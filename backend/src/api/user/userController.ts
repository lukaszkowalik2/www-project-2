import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userService } from "./userService";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/constants";
import { CreateUserSchema, DeleteUserSchema, GetUsersSchema, UpdateUserSchema } from "./userModel";
import { ServiceResponseDelete, ServiceResponseItems, ServiceResponsePost } from "@/common/models/serviceResponse";
import { logger } from "@/server";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const body = CreateUserSchema.parse(req.body);
      const user = await userService.createUser(body);

      res.status(user.status).json(user);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error && error.message === "Email already exists") {
        const failed = ServiceResponsePost.failure(StatusCodes.CONFLICT, "Email already exists");
        res.status(failed.status).json(failed);
        return;
      } else if (error instanceof Error && error.message === "Username already exists") {
        const failed = ServiceResponsePost.failure(StatusCodes.CONFLICT, "Username already exists");
        res.status(failed.status).json(failed);
        return;
      }
      const failed = ServiceResponsePost.failure(StatusCodes.BAD_REQUEST, "Failed to create user");
      res.status(failed.status).json(failed);
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const params = {
        per_page: Number(req.query.per_page ?? DEFAULT_PER_PAGE),
        page: Number(req.query.page ?? DEFAULT_PAGE),
      };
      GetUsersSchema.parse(params);
      const users = await userService.getAllUsers(params);
      res.json(users);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponseItems.failure(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch users");
      res.status(failed.status).json(failed);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const params = {
        id: Number(req.params.id),
      };

      if (req.user?.userId !== params.id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to delete this user",
          status: StatusCodes.FORBIDDEN,
        });
      }
      DeleteUserSchema.parse(params);
      const user = await userService.deleteUser(params);
      res.json(user);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error && error.message === "User not found") {
        const failed = ServiceResponsePost.failure(StatusCodes.NOT_FOUND, "User not found");
        res.status(failed.status).json(failed);
        return;
      }
      const failed = ServiceResponseDelete.failure(StatusCodes.INTERNAL_SERVER_ERROR);
      res.status(failed.status).json(failed);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (req.user?.userId !== Number(id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to update this user",
          status: StatusCodes.FORBIDDEN,
        });
      }
      const body = UpdateUserSchema.parse(req.body);
      const user = await userService.updateUser(Number(id), body);
      res.json(user);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error && error.message === "User not found") {
        const failed = ServiceResponsePost.failure(StatusCodes.NOT_FOUND, "User not found");
        res.status(failed.status).json(failed);
        return;
      }
      const failed = ServiceResponsePost.failure(StatusCodes.BAD_REQUEST, "Failed to update user");
      res.status(failed.status).json(failed);
    }
  }
}

export const userController = new UserController();
