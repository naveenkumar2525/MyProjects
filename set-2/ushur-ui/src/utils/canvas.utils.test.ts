import {
  getOffset,
  getAllSteps,
  getLinesAndAddStepShapes,
} from "./canvas.utils";

test("check getOffset", () => {
  const zoomLevel1 = 0.8;
  expect(getOffset(zoomLevel1)).toStrictEqual({ offsetX: 15, offsetY: 5 });
  const zoomLevel2 = 0.7;
  expect(getOffset(zoomLevel2)).toStrictEqual({ offsetX: 15, offsetY: 0 });
  const zoomLevel3 = 1;
  expect(getOffset(zoomLevel3)).toStrictEqual({ offsetX: 16, offsetY: 3 });
  const zoomLevel4 = 1.2;
  expect(getOffset(zoomLevel4)).toStrictEqual({ offsetX: 15, offsetY: 2 });
  const zoomLevel5 = 1.4;
  expect(getOffset(zoomLevel5)).toStrictEqual({ offsetX: 15, offsetY: 0 });
  const zoomLevel6 = 1.6;
  expect(getOffset(zoomLevel6)).toStrictEqual({ offsetX: 15, offsetY: 0 });
  const zoomLevel7 = 1.8;
  expect(getOffset(zoomLevel7)).toStrictEqual({ offsetX: 15, offsetY: 0 });
});

test("check getAllSteps", () => {
  expect(getAllSteps([])).toStrictEqual({
    childfulSteps: [],
    childlessSteps: [],
  });
});

test("check getLinesAndAddStepShapes", () => {
  expect(getLinesAndAddStepShapes([])).toStrictEqual([]);
});
