import { ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../utils/test.utils";
import TagsProvider from "./Provider";
import TagsTable from "./TagsTable";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <TagsProvider>{children}</TagsProvider>;
};

test("Tags table heading renders", () => {
  render(
    <Container>
      <TagsTable />
    </Container>
  );
  const heading = screen.getByText("Tags");

  expect(heading).toBeInTheDocument();
});

test("Tags table heading renders with icon", () => {
  render(
    <Container>
      <TagsTable />
    </Container>
  );
  const icon = screen.getByRole("img", {
    hidden: true,
  });

  expect(icon).toBeInTheDocument();
});

test("Tags table columns are rendered", async () => {
  render(
    <Container>
      <TagsTable />
    </Container>
  );
  const tagName = await screen.findByText("Tag Name");
  const initialValue = await screen.findByText("Initial Value");

  expect(tagName).toBeInTheDocument();
  expect(initialValue).toBeInTheDocument();
});

test("Tags table records are rendered", async () => {
  render(
    <Container>
      <TagsTable />
    </Container>
  );
  const tagName = await screen.findByText("name");
  const dataType = await screen.findByText("uid_numeric_string");

  expect(tagName).toBeInTheDocument();
  expect(dataType).toBeInTheDocument();
});

test("Tags table select a record", async () => {
  render(
    <Container>
      <TagsTable />
    </Container>
  );
  const column = await screen.findByText("name");

  expect(column.getAttribute("style")).toBe(
    "background-color: rgb(255, 255, 255);"
  );
  await userEvent.click(column);
  expect(column.getAttribute("style")).toBe(
    "background-color: rgb(209, 243, 255);"
  );
});

test("Tags table select a record and deselect", async () => {
  render(
    <Container>
      <TagsTable />
    </Container>
  );
  const column = await screen.findByText("name");

  expect(column.getAttribute("style")).toBe(
    "background-color: rgb(255, 255, 255);"
  );
  await userEvent.click(column);
  expect(column.getAttribute("style")).toBe(
    "background-color: rgb(209, 243, 255);"
  );
  await userEvent.click(column);
  expect(column.getAttribute("style")).toBe(
    "background-color: rgb(255, 255, 255);"
  );
});
