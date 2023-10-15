import { Given, When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import config from "../support/config";

Given("Go to the main site", async function (this: ICustomWorld) {
  const { page } = this;
  await page.goto(config.BASE_URL);
  await page.locator("text=Canvas").waitFor();
});

When(
  "Change page to {string}",
  async function (this: ICustomWorld, pageName: string) {
    const { page } = this;
    await page.locator(`text=${pageName}`).click();
  }
);

Then(
  "We see a step named {string}",
  async function (this: ICustomWorld, step: string) {
    const { page } = this;
    await page.locator(`text=${step}`).waitFor();
  }
);
