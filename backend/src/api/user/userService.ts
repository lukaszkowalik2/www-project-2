import { StatusCodes } from "http-status-codes";

import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponseDelete, ServiceResponseItems, ServiceResponsePost } from "@/common/models/serviceResponse";

import { CreateUser, DeleteUser, GetUsers, GetUsersSchema, type User } from "@/api/user/userModel";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // // Retrieves a single user by their ID
  // async findById(id: number): Promise<ServiceResponse<User | null>> {
  //   try {
  //     const user = await this.userRepository.findByIdAsync(id);
  //     if (!user) {
  //       return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
  //     }
  //     return ServiceResponse.success<User>("User found", user);
  //   } catch (ex) {
  //     const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
  //     logger.error(errorMessage);
  //     return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async createUser(body: Required<CreateUser>): Promise<ServiceResponsePost<User>> {
    const user = await this.userRepository.createUser(body);
    return ServiceResponsePost.success<User>(user);
  }

  async getAllUsers(params: Required<GetUsers>): Promise<ServiceResponseItems<User>> {
    const users: User[] = await this.userRepository.getAllUsers({
      per_page: params.per_page,
      page: params.page,
    });
    const users_count = await this.userRepository.getUsersCount();
    return ServiceResponseItems.success<User>(users, StatusCodes.OK, users_count, params.page, params.per_page);
  }

  async deleteUser(params: Required<DeleteUser>): Promise<ServiceResponseDelete> {
    await this.userRepository.deleteUser(params);
    return ServiceResponseDelete.success();
  }
}

export const userService = new UserService();
