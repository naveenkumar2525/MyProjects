import { expect } from "@playwright/test";
import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

Then(
  "I will display a dropdown component with the ellipsis-vertical icon",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.fa-ellipsis-vertical`).waitFor();
  }
);

When(
  "I click on the closed Field Menu dropdown component",
  async function (this: ICustomWorld) {
    const { page } = this;
    page.locator(`.fa-ellipsis-vertical`).click();
  }
);

Then(
  "The dropdown component will display the open state",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.formMenu-container .ushur-dropdown .dropdown-menu`).waitFor();
  }
);

When(
  "I click anywhere off the open dropdown",
  async function (this: ICustomWorld) {
    const { page } = this;
    page.locator(`.fa-ellipsis-vertical`).click();
  }
);

Then(
  "The dropdown component will go into the closed state",
  async function (this: ICustomWorld) {
    const { page } = this;
    await expect(page.locator('.formMenu-container .ushur-dropdown .dropdown-menu.show')).toHaveCount(0)
  }
);

Then(
  "I will show the drop down header with the added text Field Menu",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`text= FIELD MENU`).waitFor();
  }
);

Then(
  "I will display a toggle off menu item",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.dropdown-menu >> [data-icon=toggle-off]`).waitFor();
  }
);

Then(
  "I will display a floppy-disk menu item",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.dropdown-menu >> [data-icon=floppy-disk]`).waitFor();
  }
);

Then(
  "I will display the RED action trash-can",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.dropdown-menu >> [data-icon=trash-can]`).waitFor();
  }
);
