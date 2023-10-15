import { LaunchOptions } from "@playwright/test";

const browserOptions: LaunchOptions = {
  headless: !process.env.HEADED,
  timeout: 60000 * 2,  // wait max of 2 minutes for browser
};

const config = {
  browser: process.env.BROWSER || "chromium",
  browserOptions,
  BASE_URL: process.env.BDD_BASE_URL || "http://localhost:3000",
};

export default config;
