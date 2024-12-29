import { ServiceResponsePost } from "@/common/models/serviceResponse";
import { LoginSchema } from "./authModel";
import { authService } from "./authService";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { logger } from "@/server";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const body = LoginSchema.parse(req.body);
      const authResponse = await authService.login(body);
      res.status(StatusCodes.OK).json(authResponse);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponsePost.failure(StatusCodes.BAD_REQUEST, "Failed to login");
      res.status(failed.status).send(failed);
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];

      if (!token) {
        const failed = ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "No token provided");
        return res.status(failed.status).json(failed);
      }

      const verifyResponse = await authService.verifyToken(token);
      res.status(verifyResponse.status).json(verifyResponse);
    } catch (error) {
      logger.error(error);
      const failed = ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "Failed to verify token");
      res.status(failed.status).json(failed);
    }
  }
}

export const authController = new AuthController();
