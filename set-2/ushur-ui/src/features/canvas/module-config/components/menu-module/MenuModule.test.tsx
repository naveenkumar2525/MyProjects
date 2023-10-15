import { stateFactory } from "../../../../../mocks/factories/test/state";
import { render, screen } from "../../../../../utils/test.utils";
import MenuModule from "./MenuModule";
import { MenuModule as MenuModuleType } from "../../../../../api/api";
import ModuleTypes from "../../../interfaces/module-types";

beforeEach(() => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        id: ModuleTypes.MENU_MODULE,
        type: ModuleTypes.MENU_MODULE,
        title: "Menu Information",
        text: "<h2>Main Menu</h2>",
        menuOptions: [
          {
            id: "1",
            title: "First Menu Option",
            branchToStepId: "",
          },
        ],
        menuUserSelection: "",
        errorLimitValue: "Test 3",
        errorBranchTo: "Branch Module Test 1",
      } as MenuModuleType,
    },
  });
  render(<MenuModule />, {
    preloadedState,
  });
});

test("should show the menu module as selected", () => {
  const moduleContentElement = screen.getByText("Menu Information heading");
  expect(moduleContentElement).toBeInTheDocument();
});

test("Display the Menu Option Section Initial State", () => {
  const menuOptionElement = screen.getByText("Menu Options");
  expect(menuOptionElement).toBeInTheDocument();
  const menuBranchToElement = screen.getByTestId("menu-branch-dropdown");
  expect(menuBranchToElement).toBeInTheDocument();
  expect(menuBranchToElement).toHaveTextContent("");
});

test("Display the Save to tag/database section", () => {
  const userSelectionElement = screen.getByText("Save user selection");
  expect(userSelectionElement).toBeInTheDocument();
});

test("Display the Error Limit Initial State section", () => {
  const errorLimitElement = screen.getByText("Error Limit");
  expect(errorLimitElement).toBeInTheDocument();
  const errorBranchToElement = screen.getByTestId("error-branch-dropdown");
  expect(errorBranchToElement).toBeInTheDocument();
});

test("should show the branch dropdown.", () => {
  const dropdownContentElement = screen.getByTestId("menu-branch-dropdown");
  expect(dropdownContentElement).toBeInTheDocument();
});
