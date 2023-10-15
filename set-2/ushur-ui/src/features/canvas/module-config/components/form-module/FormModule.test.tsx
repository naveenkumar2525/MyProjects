import { ReactNode } from "react";
import { render, screen } from "../../../../../utils/test.utils";
import FormModule from "./FormModule";
import { staticElements, formElements } from "./elements";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <div>{children}</div>;
};

test("Form Module is rendered", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  const formModule = screen
    .getByText("This form has no elements")
    .closest(".form-module");
  expect(formModule).toBeInTheDocument();
});

test("Form Module has the element lists", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  const elementsList = screen.getAllByRole("list");

  expect(elementsList).toHaveLength(3);
});

test("Form Module has selected elements list", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  const elementsLists = screen.getAllByRole("list");

  expect(elementsLists).toHaveLength(3);
  expect(
    elementsLists[0].closest('[data-rbd-droppable-id="selectedElements"]')
  ).toBeInTheDocument();
});

test("Form Module has static elements list", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  const elementsLists = screen.getAllByRole("list");

  expect(elementsLists).toHaveLength(3);
  expect(
    elementsLists[1].closest('[data-rbd-droppable-id="staticElements"]')
  ).toBeInTheDocument();
});

test("Form Module has form elements list", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  const elementsLists = screen.getAllByRole("list");

  expect(elementsLists).toHaveLength(3);
  expect(
    elementsLists[2].closest('[data-rbd-droppable-id="formElements"]')
  ).toBeInTheDocument();
});

test("Form Module has no selected elements", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  expect(screen.getByText("This form has no elements")).toBeInTheDocument();
});

test("Form Module has all the static elements", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );
  const elementsList = screen.getAllByRole("listitem");
  expect(elementsList).toHaveLength(
    formElements.length + staticElements.length
  );
});

test("Form Module has all the form elements", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );

  const elementsList = screen.getAllByRole("listitem");
  expect(elementsList).toHaveLength(
    formElements.length + staticElements.length
  );
});

test("Form Module has static elements heading", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );

  const heading = screen.getByText("Static elements");
  expect(heading).toBeInTheDocument();
});

test("Form Module has form elements heading", () => {
  render(
    <Container>
      <FormModule />
    </Container>
  );

  const heading = screen.getByText("Form elements");
  expect(heading).toBeInTheDocument();
});
