/*

Tests in this folder perform extended tests beyond those in BDD specifications.

The tooling/frameworks are in place to allow for further end to end tests, even against a real server.

*/

import { test, expect } from "playwright-test-coverage";

test("canvas", async ({ page }) => {
  expect(1).toBe(1);
});
