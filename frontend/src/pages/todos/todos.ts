import { checkTokenValidity } from "../../utils/auth.js";

function callback(result: { valid: boolean; userId?: number }) {
  if (!result.valid) {
    window.location.href = "/src/pages/login";
  }
}

checkTokenValidity(callback);
