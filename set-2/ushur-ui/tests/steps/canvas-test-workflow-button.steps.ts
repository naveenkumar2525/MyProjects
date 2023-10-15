import { Given, When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import config from "../support/config";
  Then(
    "I will display a Test Workflow button",
    async function (this: ICustomWorld) {
      const { page } = this;
      await page.locator(`text= Test Workflow`).click();
    }
  );