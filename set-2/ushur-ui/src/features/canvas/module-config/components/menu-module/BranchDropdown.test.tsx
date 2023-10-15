import { render, screen } from "../../../../../utils/test.utils";
import BranchDropdown from "./BranchDropdown";

beforeEach(() => {
  render(
    <BranchDropdown dropdownName="test-branch-dropdown" onClick={() => {}} />
  );
});

test("should show the branch dropdown.", () => {
  const dropdownContentElement = screen.getByTestId("test-branch-dropdown");
  expect(dropdownContentElement).toBeInTheDocument();
});
