import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "ed5802a5-ff62-4e35-931f-7618080152a4.lovableproject.com"
    ]
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    // ✔️ Produkcyjna minimalizacja kodu
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    // ✔️ Lepszy caching i ładowanie modułów
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor_react";
            if (id.includes("swiper")) return "vendor_swiper";
            return "vendor";
          }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    },

    // ✔️ Domyślnie true, ale warto jawnie włączyć do SSR i CDN
    cssCodeSplit: true,

    // ✔️ Mniejsze pliki przez zmniejszenie inline assets
    assetsInlineLimit: 4096, // domyślnie 4096 bajtów (4kb)

    // ✔️ Ustawienia katalogu wynikowego
    outDir: "dist",
    sourcemap: false
  }
}));
