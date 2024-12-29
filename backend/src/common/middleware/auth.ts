import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";

interface JWTPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "No token provided",
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = verifyToken(token) as JWTPayload | null;
  if (!payload) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  req.user = payload;
  next();
};
