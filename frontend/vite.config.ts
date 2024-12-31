import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/pages/index.html"),
        login: resolve(__dirname, "src/pages/login/index.html"),
        register: resolve(__dirname, "src/pages/register/index.html"),
        todos: resolve(__dirname, "src/pages/todos/index.html"),
        notFound: resolve(__dirname, "src/pages/404/index.html"),
      },
    },
  },
});
