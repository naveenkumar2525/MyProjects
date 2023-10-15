import { expect } from "@playwright/test";
import { Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

Then('I add a Menu Option', async function (this: ICustomWorld) {
  const { page } = this;
  const addOption = await page.waitForSelector(
    ".add-menu-option"
  );
  addOption.click();
})

Then('I will see a new option with text {string}', async function (this: ICustomWorld, text: string) {
    const { page } = this;
    await page.locator(`text=Next Menu Option`).waitFor();
    const nextMenuOption = await page.waitForSelector(
        ".menu-options >> text=Next Menu Option"
      );
    nextMenuOption.click();
    expect(nextMenuOption).toBeDefined();
})

Then('I will see a branch to dropdown', async function (this: ICustomWorld) {
    const { page } = this;
    const branchToDropdown = await page.waitForSelector(
      ".menu-branch-dropdown"
    );
    expect(branchToDropdown).toBeDefined()
})

Then('Click on Add Menu Option again', async function (this: ICustomWorld) {
  const { page } = this;
  const addOption = await page.waitForSelector(
    ".add-menu-option"
  );
  addOption.click();
})

Then('I will see the button with text add another option', async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(`text=Add another option`).waitFor();
})