import { When } from "@cucumber/cucumber";
import { expect, Page } from "@playwright/test";
import { ICustomWorld } from "../support/custom-world";

async function deleteModule(page: Page, position: number) {

  const hoverSelector = `.configured-modules-container >> [data-rbd-draggable-id]:nth-child(${position})`;
  await page.hover(hoverSelector);

  await page.waitForTimeout(500);

  // After hovering the delete trash can and tooltip should appear
  const delSelector = `.configured-modules-container >> [data-icon="trash-can"]`;
  const trashCanElement = await page.waitForSelector(delSelector);

  await page.hover(delSelector);
  expect(page.locator(`text=Delete Module`)).toHaveCount(1);

  await trashCanElement.click();
};

When("I attempt to delete the Welcome steps's first module", async function (this: ICustomWorld) {
  const { page } = this;
  await deleteModule(page, 1);
});

When("I delete a message module in position {string}", async function (this: ICustomWorld, position: string) {
  const { page } = this;
  await deleteModule(page, parseInt(position, 10));
});