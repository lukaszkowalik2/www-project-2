import { showAlert } from "../../utils/notifications.js";
import { type LoginInput, LoginSchema } from "../../schemas/login.js";
import { checkTokenValidity } from "../../utils/auth.js";
import { login } from "../../services/auth.services.js";
import { ROUTES } from "../../constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm") as HTMLFormElement;

  const showFieldError = (fieldId: string, message: string) => {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    const existingError = document.getElementById(`${fieldId}-error`);

    field.classList.add("border-red-500");

    if (!existingError) {
      const errorDiv = document.createElement("div");
      errorDiv.id = `${fieldId}-error`;
      errorDiv.className = "text-red-500 text-sm mt-1";
      errorDiv.textContent = message;
      field.parentElement?.appendChild(errorDiv);
    } else {
      existingError.textContent = message;
    }
  };

  const clearFieldError = (fieldId: string) => {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    const existingError = document.getElementById(`${fieldId}-error`);

    field.classList.remove("border-red-500");
    existingError?.remove();
  };

  const clearAllFieldErrors = () => {
    ["email", "password"].forEach((fieldId) => {
      clearFieldError(fieldId);
    });
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAllFieldErrors();

    const formData = new FormData(loginForm);
    const loginData: LoginInput = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const validatedData = LoginSchema.safeParse(loginData);

      if (!validatedData.success) {
        validatedData.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          showFieldError(field, err.message);
        });
        return;
      }

      const response = await login(validatedData.data);

      if (response.success && response.item) {
        localStorage.setItem("token", response.item);
        showAlert("Successfully logged in!", "success");
        window.location.href = ROUTES.TODOS;
      } else {
        showAlert("Login failed. Please try again.", "error");
      }
    } catch (error) {
      if (error instanceof Error) {
        showAlert(error.message, "error");
      } else {
        showAlert("Login failed. Please check your credentials.", "error");
      }
    }
  });
});

function callback(result: { valid: boolean; userId?: number }) {
  if (result.valid) {
    window.location.href = ROUTES.TODOS;
  }
}

checkTokenValidity(callback);
