import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render, screen } from "../../../../../utils/test.utils";
import ElementsList from "./ElementsList";
import { staticElements, formElements } from "./elements";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <DragDropContext onDragEnd={() => {}}>{children}</DragDropContext>;
};

test("Static Elements List is rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId"
        elements={staticElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getByRole("list");

  expect(elementsList).toBeInTheDocument();
});

test("All the static Elements List Items are rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId"
        elements={staticElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getAllByRole("listitem");

  expect(elementsList).toHaveLength(staticElements.length);
});

test("Form Elements List is rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId"
        elements={formElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getByRole("list");

  expect(elementsList).toBeInTheDocument();
});

test("All the form Elements List Items are rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId"
        elements={formElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getAllByRole("listitem");

  expect(elementsList).toHaveLength(formElements.length);
});

test("Multiple static Elements List are rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId1"
        elements={staticElements}
        isDropDisabled
      />

      <ElementsList
        droppableId="droppableId2"
        elements={staticElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getAllByRole("list");

  expect(elementsList).toHaveLength(2);
});

test("Multiple form Elements List are rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId1"
        elements={formElements}
        isDropDisabled
      />

      <ElementsList
        droppableId="droppableId2"
        elements={formElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getAllByRole("list");

  expect(elementsList).toHaveLength(2);
});

test("Multiple Elements List are rendered", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId1"
        elements={staticElements}
        isDropDisabled
      />

      <ElementsList
        droppableId="droppableId2"
        elements={formElements}
        isDropDisabled
      />
    </Container>
  );
  const elementsList = screen.getAllByRole("list");

  expect(elementsList).toHaveLength(2);
});

test("Elements List implements Droppable Item", () => {
  render(
    <Container>
      <ElementsList
        droppableId="droppableId"
        elements={staticElements}
        isDropDisabled
      />
    </Container>
  );
  const droppableItem = screen
    .getByRole("list")
    .closest("[data-rbd-droppable-id]");

  expect(droppableItem).toBeInTheDocument();
});
