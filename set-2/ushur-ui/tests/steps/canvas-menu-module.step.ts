import { Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

Then("Select {string} module", async function (this: ICustomWorld, text: string) {
  const { page } = this;

  const menuModule = await page.waitForSelector(
    `.configured-modules-container >> text=${text}`
  );

  await menuModule.click();
});