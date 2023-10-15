import { render, screen } from "../../../../../utils/test.utils";
import AddStepModal from "./AddStepModal";

beforeEach(() => {
  render(
    <AddStepModal
      showModal
      onCancel={() => {}}
      onFinish={() => {}}
      onDismiss={() => {}}
    />
  );
});

test("should show all elements required", () => {
  const element1 = screen.getByText("Name this step");
  expect(element1).toBeInTheDocument();
  const element2 = screen.getByDisplayValue("New Step");
  expect(element2).toBeInTheDocument();
  const element3 = screen.getByText("Cancel");
  expect(element3).toBeInTheDocument();
  const element4 = screen.getByText("Finish");
  expect(element4).toBeInTheDocument();
});
