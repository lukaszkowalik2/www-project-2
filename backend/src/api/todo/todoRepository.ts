import { prisma } from "@/prismaClient";

import type { CreateTodoInput, GetTodoInput, UpdateTodoInput } from "./todoModel";

export class TodoRepository {
  async create(data: CreateTodoInput) {
    return prisma.todo.create({ data });
  }

  async update(id: number, data: UpdateTodoInput) {
    return prisma.todo.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  }

  async delete(id: number) {
    return prisma.todo.delete({ where: { id } });
  }

  async findById(id: number) {
    return prisma.todo.findUnique({ where: { id } });
  }

  async findByUserId(userId: number) {
    return prisma.todo.findMany({ where: { userId } });
  }

  async findAllForUser(params: GetTodoInput) {
    const skip = (params.page - 1) * params.per_page;

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { user_id: params.id },
        skip,
        take: params.per_page,
        orderBy: { created_at: "desc" },
      }),
      prisma.todo.count({
        where: {
          user_id: params.id,
        },
      }),
    ]);

    return { todos, total };
  }

  async countTodosByUserId(userId: number) {
    return prisma.todo.count({ where: { user_id: userId } });
  }
}

export const todoRepository = new TodoRepository();
