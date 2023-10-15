import {
  BeforeAll,
  Before,
  After,
  AfterAll,
  setDefaultTimeout,
  setWorldConstructor,
} from "@cucumber/cucumber";
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
} from "@playwright/test";
import config from "./config";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { CustomWorld, ICustomWorld } from "./custom-world";

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output_bdd');

export function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

setDefaultTimeout((process.env.PWDEBUG || process.env.HEADED) ? -1 : 60 * 1000 * 5);
setWorldConstructor(CustomWorld);

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;

declare global {
  let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

BeforeAll(async () => {
  switch (config.browser) {
    case "firefox":
      browser = await firefox.launch(config.browserOptions);
      break;
    case "webkit":
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: ICustomWorld) {
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.PWVIDEO ? { dir: "tests/videos" } : undefined,
    viewport: { width: 1200, height: 800 },
  });
  await this.context.addInitScript(() =>
    window.addEventListener('beforeunload', () =>
      (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))
    ),
  );
  await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
  await this.context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
    if (coverageJSON)
      fs.writeFileSync(path.join(istanbulCLIOutput, `bdd_coverage_${generateUUID()}.json`), coverageJSON);
  });
  this.page = await this.context.newPage();
});

After(async function (this: ICustomWorld) {
  for (const page of this?.context?.pages() ?? []) {
    await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)))
  }
  await this.page?.close();
  await this.context?.close();
});
