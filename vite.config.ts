import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["ed5802a5-ff62-4e35-931f-7618080152a4.lovableproject.com"],
    proxy: {
      '/api': {
        target: 'https://premium-digital-harvest-p89j.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
