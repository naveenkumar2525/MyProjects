import { When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import config from "../support/config";
import { expect } from "@playwright/test";

Then(
  "I will see a button dropdown with a gear icon",
  async function (this: ICustomWorld) {
    const { page } = this;
    page.locator('button[tooltipText="Workflow Menu"]');
  }
);

When("I hover over the gear button", async function (this: ICustomWorld) {
  const { page } = this;
  await page.hover(".dropdown-toggle");
});

Then(
  "I will see {string} as the tooltip text",
  async function (this: ICustomWorld, tooltipText: string) {
    const { page } = this;
    await page.locator(`text=${tooltipText}`).waitFor();
  }
);

When("I move off of the gear button", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(`.canvas`).click();
});

Then(
  "I will not see {string} as the tooltip text",
  async function (this: ICustomWorld, tooltipText: string) {
    const { page } = this;

    // TODO: Find a better way
    // CI/CD sometimes fails without this
    await page.waitForTimeout(1000);

    expect(await page.locator(`text="Workflow Menu"`).count()).toEqual(0);
  }
);

Then("a dropdown menu will appear", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(".dropdown-menu");
});

Then("I will see a divider line", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator('hr[role="separator"]').click();
});

When(
  "I click on the Workflow Menu button",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(".dropdown-toggle").click();
  }
);

Then(
  "I will see the menu category text {string}",
  async function (this: ICustomWorld, menuName) {
    const { page } = this;
    await page.locator(`text=${menuName}`);
  }
);

When(
  "I click on option {string}",
  async function (this: ICustomWorld, menuName) {
    const { page } = this;
    if (menuName === "Delete") {
      await page.locator('a[role="button"]:has-text("Delete")').click();
    } else {
      await page.locator(`button:has-text("${menuName}")`).click();
    }
  }
);

Then("the menu will disappear", async function (this: ICustomWorld) {
  const { page } = this;
  expect(await page.locator(".dropdown-menu.show").count()).toEqual(0);
});
