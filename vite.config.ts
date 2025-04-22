import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase from default 500kb to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth'],
          'form-utils': ['@hookform/resolvers', 'react-hook-form', 'zod'],
          'ui-components': ['@radix-ui/react-accordion', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-label'],
        }
      }
    }
  }
})
