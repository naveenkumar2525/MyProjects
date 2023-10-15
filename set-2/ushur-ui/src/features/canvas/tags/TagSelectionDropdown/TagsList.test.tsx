import { ReactNode } from "react";
import { render, screen } from "../../../../utils/test.utils";
import TagsProvider from "../Provider";
import TagsList from "./TagsList";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <TagsProvider>{children}</TagsProvider>;
};

test("Tag Selection Dropdown Tags List Heading renders", () => {
  render(
    <Container>
      <TagsList />
    </Container>
  );
  const heading = screen.getByText("Tags");

  expect(heading).toBeInTheDocument();
});

test("Tag Selection Dropdown Tags List renders", () => {
  render(
    <Container>
      <TagsList />
    </Container>
  );
  const list = screen.getByRole("list");

  expect(list).toBeInTheDocument();
});
