import { checkEmptyObject, uuid, formatVirtualNumber } from "./helpers.utils";

test("checkEmptyObject - verify", () => {
  expect(checkEmptyObject({})).toBe(true);
  expect(checkEmptyObject({ a: 5 })).toBe(false);
});

test("uuid - default length 6", () => {
  let result = uuid();
  expect(result.length).toBe(6);

  result = uuid(8);
  expect(result.length).toBe(8);
});

test("format virtual number - Show Workflow Number when default number is not passed", () => {
  let result = formatVirtualNumber("","12182559723");
  expect(result).toBe("+1(218) 255-9723");
});

test("format virtual number - Show Workflow Number when default number is also passed", () => {
  let result = formatVirtualNumber("14567891234","12182559723");
  expect(result).toBe("+1(218) 255-9723");
});

test("format virtual number - Show Default Number when workflow number is NOT passed", () => {
  let result = formatVirtualNumber("14567891234","");
  expect(result).toBe("+1(456) 789-1234");
});

test("format virtual number - when both the numbers are not passed", () => {
  let result = formatVirtualNumber("","");
  expect(result).toBe("");
});

test("format virtual number - when invalid default number is passed", () => {
  let result = formatVirtualNumber("abc","");
  expect(result).toBe("");
});

test("format virtual number - when invalid workflow number is passed", () => {
  let result = formatVirtualNumber("","abc");
  expect(result).toBe("");
});

test("format virtual number - when both invalid numbers are passed", () => {
  let result = formatVirtualNumber("","abc");
  expect(result).toBe("");
});