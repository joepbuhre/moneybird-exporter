import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: "../dist/frontend",
    },
    envDir: '../',
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false,
            },
            "/socket.io": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false,
            }
        },
    }
});
