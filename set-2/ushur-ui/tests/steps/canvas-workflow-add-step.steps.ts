import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { expect } from "@playwright/test";

When(
  "I hover over line under {string} step",
  async function (this: ICustomWorld, stepName: string) {
    const { page } = this;
    const line = page.locator(
      `[joint-selector="line"]:near(:text("${stepName}"))`
    );
    await line.hover();
  }
);
Then(
  "I see a button in middle of line under {string} step",
  async function (this: ICustomWorld, stepName: string) {
    const { page } = this;
    const button = page.locator(
      `circle[joint-selector="button"]:near(:text("${stepName}"))`
    );
    await button.waitFor();
  }
);
When(
  "I click button in middle of line under {string} step",
  async function (this: ICustomWorld, stepName: string) {
    const { page } = this;
    const button = page.locator(`.joint-tool:near(:text("${stepName}"))`);
    await button.waitFor();
    await button.click();
  }
);
Then(
  "I will see a popup with three menus",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.joint-popup`).waitFor();
    await page.locator('text="ADD STEP"').waitFor();
    await page.locator('text="In this branch"').waitFor();
    await page.locator('text="On new branch"').waitFor();
    await page.locator('text="Delete branch"').waitFor();
  }
);
Then(
  "I see {string} in popup",
  async function (this: ICustomWorld, menu: string) {
    const { page } = this;
    const menuBtn = page.locator(`[role="presentation"]:has-text("${menu}")`);
    await menuBtn.waitFor();
  }
);
Then(
  "clicking {string} makes total steps count plus one",
  async function (this: ICustomWorld, menu: string) {
    const { page } = this;
    const prevStepsCount = await page.locator(".joint-type-app-step").count();
    const menuBtn = page.locator(`[role="presentation"]:has-text("${menu}")`);
    await menuBtn.waitFor();
    await menuBtn.click();
    const steps = page.locator(".joint-type-app-step");
    await expect(steps).toHaveCount(prevStepsCount + 1);
  }
);
Then(
  "clicking {string} makes total links count minus one",
  async function (this: ICustomWorld, menu: string) {
    const { page } = this;
    const prevLinksCount = await page.locator(".joint-type-app-link").count();
    const menuBtn = page.locator(`[role="presentation"]:has-text("${menu}")`);
    await menuBtn.waitFor();
    await menuBtn.click();
    const links = page.locator(".joint-type-app-link");
    await expect(links).toHaveCount(prevLinksCount - 1);
  }
);
Then("I see a new step is created", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator('text="New Step"').waitFor();
});
