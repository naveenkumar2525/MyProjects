import { expect } from "@playwright/test";
import { Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";

Then("I see the button named Test Workflow", async function (this: ICustomWorld){
  const {page} = this;
  expect(
    await page.getByText("Test Workflow").count()
  )
  .toEqual(1)
  
});

Then("I click on Test Workflow", async function (this: ICustomWorld) {
  const { page } = this;
  await page.getByText("Test Workflow").click();
  
  expect(
    await page.getByTestId('simulator-panel').count()
  ).toEqual(1);

  expect(
    await page.getByRole('button', { name: 'Close' }).count()
  ).toEqual(1);
  expect(
    await page.getByText('Workflow Process').count()
  ).toEqual(1);

  expect(
    await page.getByText('Datatables').count()
  ).toEqual(1);
  
  expect(
    await page.getByText('Warning').count()
  ).toEqual(1);

  expect(
    await page.getByText('Variables').count()
  ).toEqual(1);

  expect(
    await page.getByText('Errors').count()
  ).toEqual(1);
});

Then("I choose my favourite city", async function (this: ICustomWorld) {
  const { page } = this;
  await page.waitForTimeout(1000);
  expect(
    await page.getByPlaceholder('Type here').count()
  ).toEqual(1);

  expect(
    await page.getByText(/Choose your favorite city/).count()
  ).toEqual(2);
});

Then("I enter my favourite sport", async function (this: ICustomWorld) {
  const { page } = this;
  await page.getByPlaceholder('Type here').fill('1');
  await page.getByPlaceholder('Type here').press('Enter');
  await page.waitForTimeout(1000);
  expect(await page.getByText("What's your favorite sport?").count()).toEqual(2);
});

Then("I click on maximise workflow process", async function (this: ICustomWorld) {
  const { page } = this;
  await page.getByTestId("expand-workflow-process").click();
  
  expect(await page.getByTestId("simulator-bottom").getAttribute("style")).toContain("0.75");
});

Then("I click on minimise workflow process", async function (this: ICustomWorld) {
  const { page } = this;
  await page.getByTestId("minimise-workflow-process").click();
  
  expect(await page.getByTestId("simulator-bottom").getAttribute("style")).toContain("0.25");
});

Then("I finish my simulation session", async function(this:ICustomWorld){
  const { page } = this;
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(1000);
  expect(
    await page.getByTestId('simulator-panel').count()
  ).toEqual(0);
})