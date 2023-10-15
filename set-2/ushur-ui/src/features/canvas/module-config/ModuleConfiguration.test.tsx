import { stateFactory } from "../../../mocks/factories/test/state";
import { render, screen } from "../../../utils/test.utils";
import { getModuleTitle } from "../data/utils/module";
import ModuleTypes from "../interfaces/module-types";
import ModuleList, { getModuleType } from "./ModuleConfiguration";

test("getModuleTitle func should work properly", () => {
  expect(getModuleTitle(ModuleTypes.MESSAGE_MODULE)).toStrictEqual("Message");
  expect(getModuleTitle(ModuleTypes.MENU_MODULE)).toStrictEqual("Menu");
  expect(getModuleTitle(ModuleTypes.FORM_MODULE)).toStrictEqual("Form");
  expect(getModuleTitle(ModuleTypes.BRANCH_MODULE)).toStrictEqual("Branch");
  expect(getModuleTitle(ModuleTypes.COMPUTE_MODULE)).toStrictEqual("Compute");
  expect(getModuleTitle(ModuleTypes.AI_MODULE)).toStrictEqual("AI/ML");
});
test("getModuleType func should work properly", () => {
  expect(getModuleType(ModuleTypes.MESSAGE_MODULE)).toStrictEqual(
    ModuleTypes.MESSAGE_MODULE
  );
  expect(getModuleType(ModuleTypes.MENU_MODULE)).toStrictEqual(
    ModuleTypes.MENU_MODULE
  );
  expect(getModuleType(ModuleTypes.FORM_MODULE)).toStrictEqual(
    ModuleTypes.FORM_MODULE
  );
  expect(getModuleType(ModuleTypes.BRANCH_MODULE)).toStrictEqual(
    ModuleTypes.BRANCH_MODULE
  );
  expect(getModuleType(ModuleTypes.COMPUTE_MODULE)).toStrictEqual(
    ModuleTypes.COMPUTE_MODULE
  );
  expect(getModuleType(ModuleTypes.AI_MODULE)).toStrictEqual(
    ModuleTypes.AI_MODULE
  );
});
test("should show the a list of configurable modules", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: undefined, // No module is selected.
    },
  });

  render(<ModuleList />, {
    preloadedState,
  });
  const moduleElement = screen.getByText("Engagement modules");
  expect(moduleElement).toBeInTheDocument();
});
