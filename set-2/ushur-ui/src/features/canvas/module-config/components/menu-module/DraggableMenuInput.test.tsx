import { render, screen } from "../../../../../utils/test.utils";
import DraggableMenuInput from "./DraggableMenuInput";

beforeEach(() => {
  const currentMenuOptionObj = {
    id: "1",
    title: "First Menu Option",
    branchToStepId: "",
  };
  render(
    <DraggableMenuInput
      currentMenuOption={currentMenuOptionObj}
      index={0}
      onEvent={() => {}}
      isHovered
      draggableBorder=""
    />
  );
});

test("should show the menu option as selected", () => {
  const moduleContentElement = screen.getByText("First Menu Option");
  expect(moduleContentElement).toBeInTheDocument();
});

test("should have the branch dropdown visible", () => {
  const dropdownContentElement = screen.getByTestId("menu-branch-dropdown");
  expect(dropdownContentElement).toBeInTheDocument();
});

test("should have the up/down icon in the menu option when its hovered.", () => {
  const upDownIconElement = screen.getByTestId("up-down-icon");
  expect(upDownIconElement).toBeDefined();
});

test("should have the delete icon in the menu option when its hovered.", () => {
  const deleteElement = screen.getByTestId("delete-icon");
  expect(deleteElement).toBeDefined();
});
