import ky from "ky";
import { showLoader, hideLoader } from "./loader.js";

export const checkTokenValidity = (callback?: (result: { valid: boolean; userId?: number }) => void): void => {
  const token = localStorage.getItem("token");
  showLoader();

  if (!token) {
    hideLoader();
    callback?.({ valid: false });
    return;
  }

  ky.get("http://localhost:8080/auth/health", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .json<{ success: boolean; item: { valid: boolean; user_id: number } }>()
    .then((response) => {
      hideLoader();
      if (!response.success || !response.item.valid) {
        localStorage.removeItem("token");
        callback?.({ valid: false });
        return;
      }

      callback?.({
        valid: true,
        userId: response.item.user_id,
      });
    })
    .catch((error) => {
      hideLoader();
      localStorage.removeItem("token");
      callback?.({ valid: false });
      window.location.href = "/src/pages/404";
    });
};

export const isAuthenticated = (callback: (isValid: boolean) => void): void => {
  checkTokenValidity((result) => {
    callback(result.valid);
  });
};

export const logout = (): void => {
  localStorage.removeItem("token");
  window.location.href = "/src/pages/login";
};
