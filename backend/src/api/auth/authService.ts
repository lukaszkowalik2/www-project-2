import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "@/common/utils/jwt";

import { authRepository } from "./authRepository";
import { generateTokens } from "@/common/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { ServiceResponseItem } from "@/common/models/ServiceResponseItem";

import type { LoginInput } from "./authModel";

class AuthService {
  async login(data: Required<LoginInput>) {
    const user = await authRepository.getUserByEmail(data.email);

    if (!user) {
      return ServiceResponse.failure(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      return ServiceResponse.failure(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const tokens = generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);
    await authRepository.updateLastLogin(user.id);

    return ServiceResponseItem.success(tokens.accessToken, StatusCodes.OK);
  }

  async verifyToken(token: string) {
    try {
      const payload = verifyToken(token) as JwtPayload | null;
      if (!payload) {
        return ServiceResponse.failure(StatusCodes.UNAUTHORIZED, "Invalid token");
      }

      const user = await authRepository.getUserById(payload.userId);
      if (!user) {
        return ServiceResponse.failure(StatusCodes.UNAUTHORIZED, "User not found");
      }

      return ServiceResponseItem.success({ valid: true, user_id: user.id }, StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
  }
}

export const authService = new AuthService();
