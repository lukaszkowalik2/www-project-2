import { RegisterSchema, type RegisterInput } from "../../schemas/register.js";
import { showAlert } from "../../utils/notifications.js";
import { checkTokenValidity } from "../../utils/auth.js";

import { register } from "../../services/auth.services.js";
import { ROUTES } from "../../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm") as HTMLFormElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement;

  passwordInput.addEventListener("input", () => validatePasswords(passwordInput, confirmPasswordInput));
  confirmPasswordInput.addEventListener("input", () => validatePasswords(passwordInput, confirmPasswordInput));

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAllFieldErrors();

    if (!validatePasswords(passwordInput, confirmPasswordInput)) {
      return;
    }

    const formData = new FormData(registerForm);
    const registerData: RegisterInput = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      avatar: formData.get("avatar") as string,
      bio: formData.get("bio") as string,
    };

    try {
      const validatedData = RegisterSchema.safeParse(registerData);

      if (!validatedData.success) {
        validatedData.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          showFieldError(field, err.message);
        });
        return;
      }

      const response = await register(validatedData.data);
      if (response.item?.token) {
        showAlert("Registration successful!", "success");
        localStorage.setItem("token", response.item.token);
        window.location.href = ROUTES.TODOS;
      } else {
        showAlert("Registration failed. Please try again.", "error");
      }
    } catch (error) {
      showAlert("Registration failed. Please try again.", "error");
    }
  });
});

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

const validatePasswords = (passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement) => {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  passwordInput.classList.remove("border-red-500", "border-green-500");
  confirmPasswordInput.classList.remove("border-red-500", "border-green-500");

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber) {
    showFieldError("password", "Password must be at least 8 characters and contain uppercase, lowercase, and numbers");
    return false;
  }

  if (password !== confirmPassword && confirmPassword !== "") {
    showFieldError("confirmPassword", "Passwords do not match");
    return false;
  }

  clearFieldError("password");
  clearFieldError("confirmPassword");
  return true;
};

const clearFieldError = (fieldId: string) => {
  const field = document.getElementById(fieldId) as HTMLInputElement;
  const existingError = document.getElementById(`${fieldId}-error`);

  field.classList.remove("border-red-500");
  existingError?.remove();
};

const clearAllFieldErrors = () => {
  ["email", "password", "confirmPassword", "name", "avatar", "bio"].forEach((fieldId) => {
    clearFieldError(fieldId);
  });
};

function callback(result: { valid: boolean; userId?: number }) {
  if (result.valid) {
    window.location.href = ROUTES.TODOS;
  }
}

checkTokenValidity(callback);
