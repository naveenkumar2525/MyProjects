import { ReactNode } from "react";
import { render, screen } from "../../../../utils/test.utils";
import TagsProvider from "../Provider";
import DatatableTagsList from "./DatatableTagsList";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <TagsProvider>{children}</TagsProvider>;
};

test("Tag Selection Dropdown Datatable Tags List Heading renders", () => {
  render(
    <Container>
      <DatatableTagsList />
    </Container>
  );
  const heading = screen.getByText("Datatables");

  expect(heading).toBeInTheDocument();
});

test("Tag Selection Dropdown Datatable Tags List renders", () => {
  render(
    <Container>
      <DatatableTagsList />
    </Container>
  );
  const list = screen.getByRole("list");

  expect(list).toBeInTheDocument();
});
