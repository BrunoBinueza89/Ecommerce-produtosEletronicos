import { defineConfig } from "@playwright/test";

const apiBaseUrl = "http://127.0.0.1:3000/api";

export default defineConfig({
  testDir: "./tests/browser-e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  reporter: "list",
  use: {
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: [
    {
      command: "npm run start --workspace backendAPI-shopMax",
      url: "http://127.0.0.1:3000/api/health",
      reuseExistingServer: false,
      timeout: 120_000
    },
    {
      command: `node ./scripts/run-vite-app.mjs frontEnd-shopMax 4173 ${apiBaseUrl}`,
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
      timeout: 120_000
    },
    {
      command: `node ./scripts/run-vite-app.mjs frontEnd-adminPanel 4174 ${apiBaseUrl}`,
      url: "http://127.0.0.1:4174",
      reuseExistingServer: false,
      timeout: 120_000
    }
  ]
});
