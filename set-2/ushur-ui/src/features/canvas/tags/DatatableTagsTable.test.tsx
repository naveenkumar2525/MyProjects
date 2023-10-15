import { ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../utils/test.utils";
import TagsProvider from "./Provider";
import DataTableTagsTable from "./DatatableTagsTable";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <TagsProvider>{children}</TagsProvider>;
};

test("Datatable tags table heading renders", () => {
  render(
    <Container>
      <DataTableTagsTable />
    </Container>
  );
  const heading = screen.getByText("Datatables");

  expect(heading).toBeInTheDocument();
});

test("Datatable tags table heading renders with icon", () => {
  render(
    <Container>
      <DataTableTagsTable />
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
      <DataTableTagsTable />
    </Container>
  );
  const datatable = await screen.findByText("Datatable");
  const property = await screen.findByText("Property");

  expect(datatable).toBeInTheDocument();
  expect(property).toBeInTheDocument();
});

test("Tags table records are rendered", async () => {
  render(
    <Container>
      <DataTableTagsTable />
    </Container>
  );
  const property = await screen.findByText("EmailAddress");
  const dataType = await screen.findByText("uid_email");

  expect(property).toBeInTheDocument();
  expect(dataType).toBeInTheDocument();
});

test("Tags table select a record", async () => {
  render(
    <Container>
      <DataTableTagsTable />
    </Container>
  );
  const column = await screen.findByText("EmailAddress");

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
      <DataTableTagsTable />
    </Container>
  );
  const column = await screen.findByText("EmailAddress");

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
