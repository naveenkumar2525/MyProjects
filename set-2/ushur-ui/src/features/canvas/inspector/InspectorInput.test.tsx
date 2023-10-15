import { render, screen } from "../../../utils/test.utils";
import InspectorInput from "./InspectorInput";

test("should render inspector input", () => {
  const setCheck = () => {};
  render(
    <InspectorInput
      cellId="test-id"
      className="test-class"
      type="text"
      spellCheck
      placeholder="test-placeholder"
      defaultValue="test-value"
      setCheck={setCheck}
    />
  );
  const element = screen.queryByDisplayValue("test-value");
  expect(element).toBeInTheDocument();
  const element1 = screen.queryByPlaceholderText("test-placeholder");
  expect(element1).toBeInTheDocument();
});
