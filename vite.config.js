import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    proxy: {
      "/productos": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },

      "/clientes": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },

      "/ventas": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },

      "/stock": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },

      "/caja": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
})
