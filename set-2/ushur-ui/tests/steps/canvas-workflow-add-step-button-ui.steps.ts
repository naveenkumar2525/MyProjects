import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { expect } from "@playwright/test";

Then(
  "I will see a childless step, I will display a AddStep shape",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`g[data-type="app.AddStep"]`).first().waitFor();
  }
);

Then(
  "I will see a link from the Parent step to the AddStep shape",
  async function (this: ICustomWorld) {
    const { page } = this;
    expect(await page.locator(`g[data-type="app.Line"]`).count()).toBeGreaterThan(0);
  }
);

Then(
  "I will not allow the link to be selected or deleted",
  async function (this: ICustomWorld) {
    const { page } = this;
    expect(await page.locator(`g[data-tool-name="button"]`).count()).toBe(0);
  }
);

When("I hover over the AddStep button", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(`g[data-type="app.AddStep"]`).first().waitFor();
  await page.locator(`g[data-type="app.AddStep"]`).first().hover();
});

Then(
  "the state of the button will change to a hover state",
  async function (this: ICustomWorld) {
    const { page } = this;
    const addStepButtonLocator = page.locator(
      `g[data-type="app.AddStep"]`
    );
    const addStepButtonLocatorWithWhiteBackground = page.locator(
      `g[data-type="app.AddStep"] > circle[fill="#FFFFFF"]`
    );
    // Multiple add step buttons are present on the UI
    // When we hover, the white background on the step is replaced by a gradient
    // The following test expects one less 'add step element' with white background
    expect(await addStepButtonLocator.count() - await addStepButtonLocatorWithWhiteBackground.count()).toBe(1);
  }
);

Then(
  "I will display a tooltip centered under the button with the text {string}",
  async function (this: ICustomWorld, tooltipText: string) {
    const { page } = this;
    await page.locator(`text=${tooltipText}`).waitFor();
  }
);

When("I click on the AddStep shape", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(`g[data-type="app.AddStep"]`).first().waitFor();
  await page.locator(`g[data-type="app.AddStep"]`).first().click();
});

Then(
  "I know there are total {string} steps there",
  async function (this: ICustomWorld, countString: string) {
    const { page } = this;
    const steps = page.locator(".joint-type-app-step");
    await expect(steps).toHaveCount(parseInt(countString, 10));
  }
);
