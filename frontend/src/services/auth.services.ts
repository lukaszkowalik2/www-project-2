import ky from "ky";

import { ROUTES } from "../constants.js";

import type { ServiceResponseItem } from "../types/serviceResponses.js";
import type { LoginInput } from "../schemas/login.js";
import type { RegisterInput } from "../schemas/register.js";
import type { User } from "../types/user.js";

export async function login(data: LoginInput) {
  const response = await ky.post<ServiceResponseItem<string>>(`${import.meta.env.VITE_API_URL}/login`, {
    json: data,
  });
  return await response.json();
}

export async function register(data: RegisterInput) {
  const response = await ky.post<ServiceResponseItem<User & { token: string }>>(`${import.meta.env.VITE_API_URL}/users`, {
    json: data,
  });
  return await response.json();
}

export async function logout() {
  localStorage.removeItem("token");
  window.location.href = ROUTES.LOGIN;
}
