import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const systemChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173/anniversary/",
    launchOptions: {
      executablePath: existsSync(systemChrome) ? systemChrome : undefined,
    },
  },
  webServer: {
    command:
      "npm run preview -- --host 127.0.0.1 --port 4173 --base /anniversary/",
    url: "http://127.0.0.1:4173/anniversary/",
    reuseExistingServer: false,
  },
  reporter: "list",
});
