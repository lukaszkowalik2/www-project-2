import { StatusCodes } from "http-status-codes";

import { userRepository } from "@/api/user/userRepository";
import { ServiceResponseDelete, ServiceResponseItems, ServiceResponsePost } from "@/common/models/serviceResponse";

import { CreateUser, DeleteUser, GetUsers, UpdateUser, type User } from "@/api/user/userModel";
import { generateTokens } from "@/common/utils/jwt";
import { DEFAULT_PER_PAGE } from "@/constants";
import { DEFAULT_PAGE } from "@/constants";

export class UserService {
  async createUser(body: CreateUser): Promise<ServiceResponsePost<User & { tokens: { accessToken: string; refreshToken: string } }>> {
    const user = await userRepository.createUser(body);
    const tokens = generateTokens(user.id);
    await userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return ServiceResponsePost.success({ ...user, tokens });
  }

  async getAllUsers(params: GetUsers): Promise<ServiceResponseItems<User>> {
    const users = await userRepository.getAllUsers({
      per_page: params.per_page ?? DEFAULT_PER_PAGE,
      page: params.page ?? DEFAULT_PAGE,
      search: params.search ?? "",
    });
    const usersCount = await userRepository.getUsersCount();
    return ServiceResponseItems.success(users, StatusCodes.OK, usersCount, params.page, params.per_page);
  }

  async updateUser(id: number, data: UpdateUser): Promise<ServiceResponsePost<User>> {
    const user = await userRepository.updateUser(id, data);
    await userRepository.updateUpdatedAt(id);
    return ServiceResponsePost.success(user);
  }

  async deleteUser(params: Required<DeleteUser>): Promise<ServiceResponseDelete> {
    await userRepository.deleteUser(params);
    return ServiceResponseDelete.success();
  }

  async getUserById(id: number): Promise<ServiceResponsePost<User>> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return ServiceResponsePost.failure(StatusCodes.NOT_FOUND, "User not found");
    }
    return ServiceResponsePost.success(user);
  }
}

export const userService = new UserService();
