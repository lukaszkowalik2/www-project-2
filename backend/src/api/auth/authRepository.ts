import { prisma } from "@/prismaClient";
import { User } from "../user/userModel";

export class AuthRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        password: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });
  }

  async updateLastLogin(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { last_login: new Date() },
    });
  }

  async getUserById(userId: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });
  }
}

export const authRepository = new AuthRepository();
