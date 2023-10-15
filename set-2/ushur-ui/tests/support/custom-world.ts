import { World } from "@cucumber/cucumber";
import { BrowserContext, Page, PlaywrightTestOptions } from "@playwright/test";

export interface ICustomWorld extends World {
  context?: BrowserContext;
  page: Page;
  playwrightOptions?: PlaywrightTestOptions;
}

export class CustomWorld extends World implements ICustomWorld {
  context?: BrowserContext | undefined;

  page!: Page;

  playwrightOptions?: PlaywrightTestOptions | undefined;
}
