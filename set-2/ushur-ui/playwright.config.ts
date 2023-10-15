import { type PlaywrightTestConfig, devices } from '@playwright/test';

const WEB_SERVER_PORT = 3000;

const BASE_URL = process.env.BASE_URL ?? `http://localhost:${WEB_SERVER_PORT}/`;

// From @playwright/test - this interface is unfortunately not exported so copied here
interface TestConfigWebServer {
  command: string;
  port?: number;
  url?: string;
  ignoreHTTPSErrors?: boolean;
  timeout?: number;
  reuseExistingServer?: boolean;
  cwd?: string;
  env?: { [key: string]: string; };
}

let webServerConfig: TestConfigWebServer | TestConfigWebServer[] | undefined = undefined;

if (!process.env.BASE_URL) {
  console.log('Launching development server');
  webServerConfig = {
      command: process.env.REACT_APP_INSTRUMENT_CODE ? 'cross-env REACT_APP_INSTRUMENT_CODE=1 npm run start:msw:ci': 'npm run start:msw:ci',
      url: BASE_URL,
      timeout: 300 * 1000,
      reuseExistingServer: !process.env.CI,
  }
}

const config: PlaywrightTestConfig = {
  use: {
    trace: 'on-first-retry',
    baseURL: BASE_URL,
  },
  webServer: webServerConfig,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

export default config;
