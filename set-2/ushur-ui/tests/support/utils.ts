import { Page } from "@playwright/test";

export const dragAndDrop = async (
  page: Page,
  sourceSelector: string,
  targetSelector: string
) => {
  const source = await page.waitForSelector(sourceSelector);
  const target = await page.waitForSelector(targetSelector);
  const sourceBB = await source.boundingBox();
  const targetBB = await target.boundingBox();

  if (sourceBB && targetBB) {
    await page.mouse.move(
      sourceBB.x + sourceBB.width / 2,
      sourceBB.y + targetBB.height / 2,
      { steps: 10 }
    );

    await page.dispatchEvent(sourceSelector, "mousedown", {
      button: 0,
      force: true,
    });

    await page.mouse.move(
      targetBB.x + targetBB.width / 2,
      targetBB.y + targetBB.height / 2,
      { steps: 10 }
    );

    await page.dispatchEvent(targetSelector, "mouseup", {
      button: 0,
      force: true,
    });
  }
};

export const reorder = async (
  page: Page,
  parentSelector: string,
  sourceSelector: string,
  targetSelector: string
) => {
  const source = await page.waitForSelector(sourceSelector);
  const target = await page.waitForSelector(targetSelector);
  const sourceBB = await source.boundingBox();
  const targetBB = await target.boundingBox();

  if (sourceBB && targetBB) {
    await page.mouse.move(
      sourceBB.x + sourceBB.width / 2,
      sourceBB.y + targetBB.height / 2,
      { steps: 10 }
    );

    await page.dispatchEvent(sourceSelector, "mousedown", {
      button: 0,
      force: true,
    });

    await page.mouse.move(
      targetBB.x + targetBB.width / 2,
      targetBB.y + targetBB.height / 2,
      { steps: 10 }
    );

    await page.dispatchEvent(parentSelector, "mouseup", {
      button: 0,
      force: true,
    });
  }
};
