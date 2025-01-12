import ky from "ky";

import type { User } from "../types/user.js";

export async function getUser(userId: number) {
  const token = localStorage.getItem("token");

  const response = await ky.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json<{ item: User }>();
}
