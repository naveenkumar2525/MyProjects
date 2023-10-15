import { expect } from "@playwright/test";
import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

Then("Open Save to Tag modal", async function (this: ICustomWorld) {
  const { page } = this;
  const dropdownToggle = page
    .locator(".field-container .dropdown-toggle")
    .first();

  await dropdownToggle.click();

  const dropdownItem = page
    .locator(
      ".field-container .dropdown-header + .dropdown-item + .dropdown-item"
    )
    .first();

  await dropdownItem.click();

  expect(await page.locator(".modal").count()).toEqual(1);
});

Then("Close Save to Tag modal", async function (this: ICustomWorld) {
  const { page } = this;
  const cancelButton = page.locator(".modal .ushur-cancel-btn").first();

  await cancelButton.click();
  await page.waitForTimeout(200);

  expect(await page.locator(".modal").count()).toEqual(0);
});

When(
  "I type a word prefixed with two consecutive flower brackets",
  async function (this: ICustomWorld) {
    const { page } = this;
    const textInput = page
      .locator('.form-module [data-testid="textInput"]')
      .first();

    await textInput.type("{{demo");
  }
);

Then("Show NoMatch component", async function (this: ICustomWorld) {
  const { page } = this;
  expect(
    await page.locator("div").getByText("No matches found.").count()
  ).toEqual(1);
});

Then("Open Create Tag Modal", async function (this: ICustomWorld) {
  const { page } = this;
  const textInput = page
    .locator('.form-module [data-testid="textInput"]')
    .first();

  await textInput.type("{{demo");

  const newTagButton = page.locator('button[aria-label="New tag"]').first();

  await newTagButton.click();

  expect(await page.locator(".modal").count()).toEqual(1);
});

Then("Close Create Tag modal", async function (this: ICustomWorld) {
  const { page } = this;
  const cancelButton = page.locator(".modal .ushur-cancel-btn").first();

  await cancelButton.click();
  await page.waitForTimeout(200);

  expect(await page.locator(".modal").count()).toEqual(0);
});

Then("Open Tag selection dropdown", async function (this: ICustomWorld) {
  const { page } = this;
  const textInput = page
    .locator('.form-module [data-testid="textInput"]')
    .first();

  await textInput.type("{{");

  expect(await page.locator(".tag-selection-dropdown").count()).toEqual(1);
});

Then("Close Tag selection dropdown", async function (this: ICustomWorld) {
  const { page } = this;
  const cancelButton = page.locator(".tag-selection-dropdown .ushur-cancel-btn").first();

  await cancelButton.click();
  await page.waitForTimeout(200);
  
  expect(await page.locator(".tag-selection-dropdown").count()).toEqual(0);
});

Then("Select a tag", async function (this: ICustomWorld) {
  const { page } = this;
  const textInput = page
    .locator('.form-module [data-testid="textInput"]')
    .first();

  await textInput.type("{{");

  expect(await page.locator(".tag-selection-dropdown").count()).toEqual(1);

  const nameTag = page
    .locator('[aria-label="name"]')
    .first();

  await nameTag.click();

  expect(await page.locator(".tag-selection-dropdown").count()).toEqual(0);
});
