import { render, fireEvent } from "../../utils/test.utils";
import SortProjectsSelect from "./SortProjectsSelect.react";

test("render SortProjectsSelect component", () => {
  const { getByText, container } = render(
    <SortProjectsSelect onChange={() => {}} />
  );
  expect(getByText("Sort by Recent")).toBeInTheDocument();

  const btn = container.querySelector("button") as HTMLElement;
  fireEvent.click(btn);
  expect(getByText("Sort Projects By")).toBeInTheDocument();
});
