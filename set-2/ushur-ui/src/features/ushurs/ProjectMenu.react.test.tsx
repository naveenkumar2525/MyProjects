import { render, fireEvent } from "../../utils/test.utils";
import ProjectMenu from "./ProjectMenu.react";

test("render ProjectMenu component", () => {
  const { getByText, container } = render(
    <ProjectMenu
      eventKey="abc"
      onMouseLeave={() => {}}
      onMouseOver={() => {}}
    />
  );
  const btn = container.querySelector("button") as HTMLElement;
  fireEvent.click(btn);
  expect(getByText("PROJECT MENU")).toBeInTheDocument();
  expect(getByText("Create Workflow")).toBeInTheDocument();
  expect(getByText("Import Workflow")).toBeInTheDocument();
});
