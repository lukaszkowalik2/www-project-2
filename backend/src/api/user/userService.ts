import { StatusCodes } from "http-status-codes";

import { userRepository } from "@/api/user/userRepository";

import { CreateUser, DeleteUser, GetUsers, UpdateUser, type User } from "@/api/user/userModel";
import { generateTokens } from "@/common/utils/jwt";
import { DEFAULT_PER_PAGE } from "@/constants";
import { DEFAULT_PAGE } from "@/constants";
import { ServiceResponseStatus } from "@/common/models/ServiceResponseStatus";
import { ServiceResponseItem } from "@/common/models/ServiceResponseItem";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { ServiceResponseItems } from "@/common/models/ServiceResponseItems";

export class UserService {
  async createUser(body: CreateUser): Promise<ServiceResponseItem<User & { token: string }>> {
    const user = await userRepository.createUser(body);
    const tokens = generateTokens(user.id);
    await userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return ServiceResponseItem.success({ ...user, token: tokens.accessToken });
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

  async updateUser(id: number, data: UpdateUser): Promise<ServiceResponseItem<User> | ServiceResponse> {
    const user = await userRepository.updateUser(id, data);
    await userRepository.updateUpdatedAt(id);
    return ServiceResponseItem.success(user);
  }

  async deleteUser(params: Required<DeleteUser>): Promise<ServiceResponseStatus> {
    await userRepository.deleteUser(params);
    return ServiceResponseStatus.success();
  }

  async getUserById(id: number): Promise<ServiceResponseItem<User> | ServiceResponse> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return ServiceResponseItem.failure(StatusCodes.NOT_FOUND, "User not found");
    }
    return ServiceResponseItem.success(user);
  }
}

export const userService = new UserService();
