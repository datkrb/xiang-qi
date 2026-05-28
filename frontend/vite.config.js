import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
export default defineConfig({
    plugins: [react(), dts()],
    resolve: {
        alias: {
            "@app": path.resolve(__dirname, "./src/app"),
            "@features": path.resolve(__dirname, "./src/features"),
            "@shared": path.resolve(__dirname, "./src/shared"),
            "@shared/ui": path.resolve(__dirname, "./src/shared/components/ui"),
            "@shared/components": path.resolve(__dirname, "./src/shared/components"),
            "@shared/hooks": path.resolve(__dirname, "./src/shared/hooks"),
            "@shared/utils": path.resolve(__dirname, "./src/shared/utils"),
            "@shared/types": path.resolve(__dirname, "./src/shared/types"),
            "@shared/services": path.resolve(__dirname, "./src/shared/services"),
            "@shared/theme": path.resolve(__dirname, "./src/shared/theme"),
            "@shared/i18n": path.resolve(__dirname, "./src/shared/i18n"),
        },
    },
    build: {
        lib: {
            entry: "./src/index.ts",
            name: "Xiangqi",
            formats: ["es", "umd"],
            fileName: function (format) { return "xiangqi.".concat(format === "es" ? "js" : "umd.js"); },
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
