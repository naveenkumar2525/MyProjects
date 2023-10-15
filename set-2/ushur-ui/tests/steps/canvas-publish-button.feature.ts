import { Given, When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

Then(
  "I will see a button named {string}",
  async function (this: ICustomWorld, buttonName: string) {
    const { page } = this;
    await page.locator(`text=${buttonName}`).waitFor();
  }
);

Then("I will see a sleeping icon", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(`.fa-face-sleeping`).waitFor();
});

When("I click the published button", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(".canvas-published").waitFor();
  await page.locator(".canvas-published").click();
});

Then(
  "the button text will change to Unpublished",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`text="Unpublished"`).waitFor();
  }
);

Then(
  "the button icon will change to a sleeping icon",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.fa-face-sleeping`);
  }
);

When("I click the unpublished button", async function (this: ICustomWorld) {
  const { page } = this;
  await page.locator(".canvas-unpublished").click();
});

Then(
  "the button text will change to Published",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`text="Published"`).waitFor();
  }
);

Then(
  "the button icon will change to a circle check icon",
  async function (this: ICustomWorld) {
    const { page } = this;
    await page.locator(`.fa-circle-check`);
  }
);

