import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../utils/test.utils";
import AddStepMenu, { AddStepMenuOptions } from "./AddStepMenu";

test("render three menu component", () => {
  render(<AddStepMenu onClickMenu={() => {}} />);
  const element1 = screen.getByText("In this branch");
  const element2 = screen.getByText("On new branch");
  const element3 = screen.getByText("Delete branch");
  expect(element1).toBeInTheDocument();
  expect(element2).toBeInTheDocument();
  expect(element3).toBeInTheDocument();
});

test("clicking menu option", async () => {
  render(
    <AddStepMenu
      onClickMenu={(option: AddStepMenuOptions) => {
        render(<p id="logtest">Log+{option}</p>);
      }}
    />
  );
  const element1 = screen.getByText("In this branch");
  const element2 = screen.getByText("On new branch");
  const element3 = screen.getByText("Delete branch");

  await userEvent.click(element1);
  expect(
    screen.getByText(`Log+${AddStepMenuOptions.AddInBranch}`)
  ).toBeInTheDocument();
  await userEvent.click(element2);
  expect(
    screen.getByText(`Log+${AddStepMenuOptions.AddOutBranch}`)
  ).toBeInTheDocument();
  await userEvent.click(element3);
  expect(
    screen.getByText(`Log+${AddStepMenuOptions.DeleteBranch}`)
  ).toBeInTheDocument();
});
