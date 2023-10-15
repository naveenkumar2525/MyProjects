import userEvent from "@testing-library/user-event";
import { stateFactory } from "../../../../../mocks/factories/test/state";
import { render, screen } from "../../../../../utils/test.utils";
import MenuOptions from "./MenuOptions";
import { MenuModule as MenuModuleType } from "../../../../../api/api";
import ModuleTypes from "../../../interfaces/module-types";

describe("when a menu option exists", () => {
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
    render(<MenuOptions />, {
      preloadedState,
    });
  });

  test("should show the menu options list header", () => {
    const moduleContentElement = screen.getByText("Menu Options");
    expect(moduleContentElement).toBeInTheDocument();
  });

  test("should show the menu options list branch to header", () => {
    const moduleContentElement = screen.getByText("Branch to...");
    expect(moduleContentElement).toBeInTheDocument();
  });

  test("should show the add menu option icon", () => {
    const moduleContentElement = screen.getByText("Add another option");
    expect(moduleContentElement).toBeInTheDocument();
  });

  test("should show the menu option as selected", () => {
    const moduleContentElement = screen.getByText("First Menu Option");
    expect(moduleContentElement).toBeInTheDocument();
  });

  test("should have the branch dropdown visible", () => {
    const dropdownContentElement = screen.getByTestId("menu-branch-dropdown");
    expect(dropdownContentElement).toBeInTheDocument();
  });

  test("should have the up/down icon in the menu option when its hovered.", async () => {
    const moduleContentElement = screen.getByText("First Menu Option");
    await userEvent.hover(moduleContentElement);
    const upDownIconElement = screen.getByTestId("up-down-icon");
    expect(upDownIconElement).toBeDefined();
  });
});

// Note that the following scenario can occur if an older workflow
// did not have the menuOptions field. This is for backward compatibility.
describe("when no menu options exist", () => {
  beforeEach(() => {
    const preloadedState = stateFactory.build({
      canvas: {
        selectedCellId: "test cell",
        selectedModule: {
          id: ModuleTypes.MENU_MODULE,
          type: ModuleTypes.MENU_MODULE,
          title: "Menu Information",
          text: "<h2>Main Menu</h2>",
          menuUserSelection: "",
          errorLimitValue: "Test 3",
          errorBranchTo: "Branch Module Test 1",
        } as MenuModuleType,
      },
    });
    render(<MenuOptions />, {
      preloadedState,
    });
  });

  test("should show the menu options list header", () => {
    const moduleContentElement = screen.getByText("Menu Options");
    expect(moduleContentElement).toBeInTheDocument();
  });

  test("should show the menu options list branch to header", () => {
    const moduleContentElement = screen.getByText("Branch to...");
    expect(moduleContentElement).toBeInTheDocument();
  });

  test("should show the add menu option icon", () => {
    const moduleContentElement = screen.getByText("Add option");
    expect(moduleContentElement).toBeInTheDocument();
  });
});
