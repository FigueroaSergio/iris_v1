import { defineConfig } from "vite";
import path from "path";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/iris_v1",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
