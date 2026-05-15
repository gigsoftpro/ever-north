import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,

    // ✅ Fix HMR not updating on some pages
    watch: {
      usePolling: true,
    },

    hmr: {
      overlay: true,
    },
  },

  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  // ✅ Prevent dependency caching issues
  optimizeDeps: {
    force: true,
  },

  // ✅ Ensure fresh builds (no stale chunks)
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
