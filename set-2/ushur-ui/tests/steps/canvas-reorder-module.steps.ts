import { When } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { dragAndDrop } from "../support/utils";


When("I reorder message modules in position {string} to position {string}", async function (this: ICustomWorld, start: string, end: string) {
  const { page } = this;
  
  const startSelector = `.configured-modules-container >> [data-rbd-draggable-id]:nth-child(${parseInt(start, 10)})`;
  const endSelector = `.configured-modules-container >> [data-rbd-draggable-id]:nth-child(${parseInt(end, 10)})`;
  
  await dragAndDrop(
    page,
    startSelector,
    endSelector,
  );

  // drag and drop seems to have flakey auto-waiting
  await page.waitForTimeout(500);
});

