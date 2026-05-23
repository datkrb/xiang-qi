import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
export default defineConfig({
    plugins: [react(), dts()],
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
