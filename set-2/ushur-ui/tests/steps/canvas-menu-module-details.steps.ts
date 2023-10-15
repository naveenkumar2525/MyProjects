import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ICustomWorld } from "../support/custom-world";

Then('I will see the field label {string}', async function (this: ICustomWorld, text: string) {
    const { page } = this;
    await page.locator(`text=${text}`).waitFor();
  })
  
  Then('I will see the section for Menu Options', async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`text=Menu Options`).waitFor();
  })
  
  Then('I will see the section for Branch To', async function (this: ICustomWorld) {
    const { page } = this;
    expect(await page.locator(`text=Branch to...`).count()).toEqual(2);
  })
  
  Then('I will see the section for Save User Selection', async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`text=Save User Selection`).waitFor();
  })
  
  Then('I will see the section for Error Limit', async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`text=Error Limit`).waitFor();
  })