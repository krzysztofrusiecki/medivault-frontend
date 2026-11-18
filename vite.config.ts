import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { loadEnv, type ProxyOptions } from "vite";
import { defineConfig } from "vitest/config";

const DEFAULT_API_PROXY_TARGET = "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Not VITE_-prefixed, so it stays in the build tool and never reaches the bundle (ADR-0008).
  const env: Partial<Record<string, string>> = loadEnv(mode, process.cwd(), "");
  // A blank value in .env (`API_PROXY_TARGET=`) falls back to the default too.
  const configuredApiProxyTarget = env.API_PROXY_TARGET?.trim() ?? "";
  const apiProxyTarget =
    configuredApiProxyTarget === ""
      ? DEFAULT_API_PROXY_TARGET
      : configuredApiProxyTarget;

  // Forwards the path unchanged: the backend also serves under /api, so the refresh cookie's Path=/api/auth still matches.
  // changeOrigin sets Host to the target's, which remote HTTPS hosts need to route the request.
  const apiProxy: Record<string, ProxyOptions> = {
    "/api": { target: apiProxyTarget, changeOrigin: true },
  };

  return {
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    // Strict so a busy port fails loudly instead of silently moving to another one.
    server: {
      port: 4200,
      strictPort: true,
      proxy: apiProxy,
    },
    preview: {
      proxy: apiProxy,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
    },
  };
});
