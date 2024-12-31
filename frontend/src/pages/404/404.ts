import { checkTokenValidity } from "../../utils/auth.js";

checkTokenValidity((result) => {
  if (result.valid) {
    const homeLink = document.querySelector('a[href="/"]');
    if (homeLink) {
      homeLink.setAttribute("href", "/src/pages/todos");
    }
  }
});
