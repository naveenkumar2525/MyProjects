import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { expect } from "@playwright/test";

let totalLinkCounts = 0;
When(
  "I drag outport of {string} step and drop it to blank area",
  async function (this: ICustomWorld, stepName: string) {
    const { page } = this;
    // Link counts
    totalLinkCounts = await page.locator(".joint-type-app-link").count();

    const source = page.locator(
      `[joint-selector="portOut"]:near(:text("${stepName}"))`
    );
    const sourceBBox = await source.boundingBox();

    // Mousemove to center of outport and press it and move to x+100 and drop it
    await page.mouse.move(
      sourceBBox!.x + sourceBBox!.width / 2,
      sourceBBox!.y + sourceBBox!.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(sourceBBox!.x + 100, sourceBBox!.y);
    await page.mouse.up();
  }
);

When(
  "I drag outport of {string} step and drop it to inport of itself",
  async function (this: ICustomWorld, stepName: string) {
    const { page } = this;
    // Link counts
    totalLinkCounts = await page.locator(".joint-type-app-link").count();

    const source = page.locator(
      `[joint-selector="portOut"]:near(:text("${stepName}"))`
    );
    const sourceBBox = await source.boundingBox();
    const target = page.locator(
      `[joint-selector="portIn"]:near(:text("${stepName}"))`
    );
    const targetBBox = await target.boundingBox();

    // Mousemove to center of outport and press it and move to inport of itself
    await page.mouse.move(
      sourceBBox!.x + sourceBBox!.width / 2,
      sourceBBox!.y + sourceBBox!.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBBox!.x + targetBBox!.width / 2,
      targetBBox!.y + targetBBox!.height / 2
    );
    await page.mouse.up();
  }
);

Then("I don't see a link created from it", async function (this: ICustomWorld) {
  const { page } = this;

  const link = page.locator(".joint-type-app-link");
  await expect(link).toHaveCount(totalLinkCounts);
});
