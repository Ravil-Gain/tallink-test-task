import { loadEnv, type ProxyOptions } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.API_URL;
  const candidateId = env.CANDIDATE_ID;

  const apiProxy: Record<string, ProxyOptions> = {
    "/api": {
      target: apiUrl,
      changeOrigin: true,
      secure: true,
      rewrite: (path) => {
        const [base, query] = path.split("?");
        const userParam = `user=${candidateId}`;
        return query ? `${base}?${query}&${userParam}` : `${base}?${userParam}`;
      },
    },
  };

  return {
    plugins: [react()],
    server: {
      proxy: apiProxy,
    },
    preview: {
      proxy: apiProxy,
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      coverage: {
        include: [
          "src/app/AppStateProvider.tsx",
          "src/app/useQuote.ts",
          "src/shared/lib/money.ts",
          "src/widgets/**/*.{ts,tsx}",
        ],
        exclude: ["**/*.test.{ts,tsx}", "src/widgets/**/types.ts"],
        thresholds: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  };
});
