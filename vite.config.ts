import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
    optimizeDeps: {
        entries: ["src/main.tsx", "src/tempobook/**/*"],
    },
    plugins: [
        react(),
        tempo(),
        eslint({
            cache: true,
            fix: true,
        }),
    ],
    resolve: {
        preserveSymlinks: true,
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        allowedHosts: true,
    }
});
