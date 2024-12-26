import { prisma } from "@/prismaClient";
import { CreateUser, DeleteUser, GetUsers, User } from "./userModel";

export class UserRepository {
  async createUser(data: CreateUser): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    return prisma.user.create({ data });
  }

  async getAllUsers(params: Required<GetUsers>): Promise<User[]> {
    return prisma.user.findMany({
      take: params.per_page,
      skip: (params.page - 1) * params.per_page,
    });
  }

  async getUsersCount(): Promise<number> {
    return prisma.user.count();
  }

  async deleteUser(params: Required<DeleteUser>): Promise<User> {
    return prisma.user.delete({ where: { id: params.id } });
  }
}
