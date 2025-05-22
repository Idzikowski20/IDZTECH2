import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import * as sass from 'sass-embedded';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["ed5802a5-ff62-4e35-931f-7618080152a4.lovableproject.com"],
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://idztech.onrender.com' 
          : 'https://idztech.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        sassOptions: {
          outputStyle: 'compressed',
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
