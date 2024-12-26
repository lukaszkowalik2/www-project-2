import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userService } from "./userService";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/Constants";
import { CreateUserSchema, DeleteUserSchema, GetUsersSchema } from "./userModel";
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
      DeleteUserSchema.parse(params);
      const user = await userService.deleteUser(params);
      res.json(user);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponseDelete.failure(StatusCodes.INTERNAL_SERVER_ERROR);
      res.status(failed.status).json(failed);
    }
  }

  // async getUserById(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const user = await userService.getUserById(Number(id));
  //   if (user) {
  //     res.json(user);
  //   } else {
  //     res.status(404).json({ error: "User not found" });
  //   }
  // }
}

export const userController = new UserController();
