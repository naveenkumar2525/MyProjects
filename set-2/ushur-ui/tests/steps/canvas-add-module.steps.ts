import { expect } from "@playwright/test";
import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { dragAndDrop } from "../support/utils";

When("I Drag and Drop the {string} module", async function (this: ICustomWorld, moduleName) {
  const { page } = this;

  const moduleNameLowercase = moduleName.toLowerCase();

  await dragAndDrop(
    page,
    `[data-rbd-draggable-id='${moduleNameLowercase}-module']`,
    "[data-rbd-droppable-id='configured-module']"
  );

  const configuredFormSelector = `.configured-modules-container >> text=${moduleName}`;

  await page.waitForSelector(configuredFormSelector);

  // drag and drop seems to have flakey auto-waiting
  await page.waitForTimeout(500);

});

Then("The number of {string} modules should be {string}", async function (this: ICustomWorld, moduleName: string, count: string) {
  const { page } = this;
  const configuredFormSelector = `.configured-modules-container >> text=${moduleName}`;

  await expect(page.locator(configuredFormSelector)).toHaveCount(parseInt(count, 10))

})
