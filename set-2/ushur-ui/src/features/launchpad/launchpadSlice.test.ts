import { ushursSelector } from "../ushurs/ushursSlice";

test("ushurs Selector", () => {
  const ushurs = [{ campaignId: "a", active: "Y" }, { campaignId: "b" }];
  const output = ushursSelector(ushurs);
  expect(output.length).toBe(1);
});
