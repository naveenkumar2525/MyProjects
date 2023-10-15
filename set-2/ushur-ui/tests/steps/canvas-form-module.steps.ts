import { expect } from "@playwright/test";
import { Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { dragAndDrop } from "../support/utils";

Then("I select the first step", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(".joint-type-app-step").first().click();
});

Then("Drag and Drop form module", async function (this: ICustomWorld) {
  const { page } = this;
  await dragAndDrop(
    page,
    "[data-rbd-draggable-id='form-module']",
    "[data-rbd-droppable-id='configured-module']"
  );

  const configuredFormSelector = ".configured-modules-container >> text=Form";

  await page.waitForSelector(configuredFormSelector);

  expect(await page.locator(configuredFormSelector).count()).toEqual(1);
});

Then("Select form module", async function (this: ICustomWorld) {
  const { page } = this;

  const formModule = await page.waitForSelector(
    ".configured-modules-container >> text=Form"
  );

  await formModule.click();
});

Then(
  "Drag and Drop Text from static elements",
  async function (this: ICustomWorld) {
    const { page } = this;
    await dragAndDrop(
      page,
      "[data-rbd-draggable-id='text']",
      "[data-rbd-droppable-id='selectedElements']"
    );

    await page.waitForSelector("[data-rbd-draggable-id='text-0']");

    expect(
      await page.locator("[data-rbd-draggable-id='text-0']").count()
    ).toEqual(1);
  }
);

Then(
  "Drag and Drop Text Input from form elements",
  async function (this: ICustomWorld) {
    const { page } = this;
    await dragAndDrop(
      page,
      "[data-rbd-draggable-id='textInput']",
      "[data-rbd-droppable-id='selectedElements']"
    );

    await page.waitForSelector("[data-rbd-draggable-id='textInput-0']");

    expect(
      await page.locator("[data-rbd-draggable-id='textInput-0']").count()
    ).toEqual(1);
  }
);
