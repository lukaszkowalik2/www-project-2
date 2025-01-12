import { prisma } from "@/prismaClient";
import { CreateUser, DeleteUser, GetUsers, UpdateUser, User } from "./userModel";
import bcrypt from "bcrypt";

export class UserRepository {
  async createUser(data: CreateUser): Promise<User> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { name: data.name }],
      },
    });

    if (existingUser) {
      throw new Error(existingUser.email === data.email ? "Email already exists" : "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });
  }

  async updateUser(id: number, data: UpdateUser): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updates: UpdateUser = { ...data };

    if (data.password) {
      updates.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });
  }

  async getAllUsers(params: Required<GetUsers>): Promise<User[]> {
    const where = params.search
      ? {
          OR: [{ name: { contains: params.search, mode: "insensitive" } }, { email: { contains: params.search, mode: "insensitive" } }],
        }
      : {};

    return prisma.user.findMany({
      where,
      take: params.per_page,
      skip: (params.page - 1) * params.per_page,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });
  }

  async getUsersCount(): Promise<number> {
    return prisma.user.count();
  }

  async deleteUser(params: Required<DeleteUser>): Promise<User> {
    const user = await this.getUserById(params.id);
    if (!user) {
      throw new Error("User not found");
    }
    return prisma.user.delete({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    });
  }

  async updateUpdatedAt(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { updated_at: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
