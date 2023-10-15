import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
 
When(
  "The inspector is opened for the {string} step",
  async function (this: ICustomWorld, pageName: string) {
    const { page } = this;
    await page.locator(`text=${pageName}`).click();
  }
);

Then(
  "The step has a description {string}",
  async function (this: ICustomWorld, step: string) {
    const { page } = this;
    await page.locator(`text=${step}`).waitFor();
  }
);

Then(
  "The step has a configured {string} module",
  async function (this: ICustomWorld, module: string) {
    const { page } = this;
    await page.locator(`.configured-modules-container >> text="${module}"`).waitFor();
  }
);

When(
  "The configured {string} module is opened",
  async function (this: ICustomWorld, module: string) {
    const { page } = this;
    await page.locator(`.configured-modules-container >> text="${module}"`).click();
  }

);

Then(
  "The {string} module has the text {string}",
  async function (this: ICustomWorld, module: string, text: string) {
    const { page } = this;
    await page.frameLocator('iframe').locator(`text="${text}"`).waitFor();
  }
);
