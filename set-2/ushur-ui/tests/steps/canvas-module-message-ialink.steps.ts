import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

When (
  "The More button is clicked",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`[title="More..."]`).click();
  }
);

Then(
  "We see a button with text {string} in the toolbar",
  async function (this: ICustomWorld, text: string) {
    const { page } = this;
    await page.locator(`button:has-text("${text}")`).waitFor();
  }
);

When (
  "Button with Insert IA Link is clicked",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`button:has-text("Insert IA Link")`).click();
  }
)

Then(
  "The {string} module contains the text {string}",
  async function (this: ICustomWorld, module: string, text: string) {
    const { page } = this;
    await page.frameLocator('iframe').locator(`p:has-text("${text}")`).waitFor();
  }
);
