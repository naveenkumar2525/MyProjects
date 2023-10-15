import { ReactNode } from "react";
import { render, screen } from "../../../../utils/test.utils";
import TagsProvider from "../Provider";
import GlobalTagsList from "./GlobalTagsList";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <TagsProvider>{children}</TagsProvider>;
};

test("Tag Selection Dropdown Global Tags List Heading renders", () => {
  render(
    <Container>
      <GlobalTagsList />
    </Container>
  );
  const heading = screen.getByText("Global Values");

  expect(heading).toBeInTheDocument();
});

test("Tag Selection Dropdown Global Tags List renders", () => {
  render(
    <Container>
      <GlobalTagsList />
    </Container>
  );
  const list = screen.getByRole("list");

  expect(list).toBeInTheDocument();
});
