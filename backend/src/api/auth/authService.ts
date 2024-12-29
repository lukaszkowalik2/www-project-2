import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "@/common/utils/jwt";

import { ServiceResponsePost } from "@/common/models/serviceResponse";
import { authRepository } from "./authRepository";
import { generateTokens } from "@/common/utils/jwt";

import type { LoginInput } from "./authModel";
import { JwtPayload } from "jsonwebtoken";

class AuthService {
  async login(data: Required<LoginInput>) {
    const user = await authRepository.getUserByEmail(data.email);

    if (!user) {
      return ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      return ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const tokens = generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);
    await authRepository.updateLastLogin(user.id);

    return ServiceResponsePost.success(tokens.accessToken, StatusCodes.OK);
  }

  async verifyToken(token: string) {
    try {
      const payload = verifyToken(token) as JwtPayload | null;
      if (!payload) {
        return ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "Invalid token");
      }

      const user = await authRepository.getUserById(payload.userId);
      if (!user) {
        return ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "User not found");
      }

      return ServiceResponsePost.success({ valid: true, userId: user.id }, StatusCodes.OK);
    } catch (error) {
      return ServiceResponsePost.failure(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
  }
}

export const authService = new AuthService();
