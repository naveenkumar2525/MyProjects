import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

When('I modify message module {string} with the text {string}', async function(this: ICustomWorld, moduleNumber: string, text: string) {
  const { page } = this;

  const configuredFormSelector = `.configured-modules-container >> text=Message`;
  const locator = page.locator(configuredFormSelector).nth(parseInt(moduleNumber, 10) - 1);
  await locator.click();

  const richTextEditorFrame = page.frameLocator('iframe');
  await richTextEditorFrame.locator('body').fill(text);

  await page.locator("[data-icon='angle-left']").click();

})

When('I open {string} module {string}', async function (this: ICustomWorld, moduleName: string, moduleNumber: string) {
  const { page } = this;
  const configuredFormSelector = `.configured-modules-container >> text=${moduleName}`;
  const locator = page.locator(configuredFormSelector).nth(parseInt(moduleNumber, 10) - 1);
  await locator.click();
})

When('I close module details', async function (this: ICustomWorld) {
  const { page } = this;
  page.locator("[data-icon='angle-left']").click();
})

Then('The message module text should be {string}', async function (this: ICustomWorld, text: string) {
  const { page } = this;
  const richTextEditorFrame = page.frameLocator('iframe');

  await richTextEditorFrame.locator(`p:has-text("${text}")`).waitFor();
})
