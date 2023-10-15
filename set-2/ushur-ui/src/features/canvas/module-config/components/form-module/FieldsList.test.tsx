import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render, screen } from "../../../../../utils/test.utils";
import FieldsList from "./FieldsList";
import { formElements } from "./elements";

const selectedElements1 = [formElements[1]];
const selectedElements2 = [
  {
    ...formElements[1],
    id: "textInput-1",
  },
  {
    ...formElements[1],
    id: "textInput-2",
  },
];

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <DragDropContext onDragEnd={() => {}}>{children}</DragDropContext>;
};

test("Fields List is rendered", () => {
  render(
    <Container>
      <FieldsList
        droppableId="droppableId"
        elements={selectedElements1}
        isDropDisabled
      />
    </Container>
  );
  const fieldsList = screen.getByRole("list");

  expect(fieldsList).toBeInTheDocument();
});

test("Fields List Items are rendered", () => {
  render(
    <Container>
      <FieldsList
        droppableId="droppableId"
        elements={selectedElements1}
        isDropDisabled
      />
    </Container>
  );
  const fieldsList = screen.getAllByRole("listitem");

  expect(fieldsList).toHaveLength(selectedElements1.length);
});

test("Fields List implements Droppable Item", () => {
  render(
    <Container>
      <FieldsList
        droppableId="droppableId"
        elements={selectedElements1}
        isDropDisabled
      />
    </Container>
  );
  const droppableItem = screen
    .getByRole("list")
    .closest("[data-rbd-droppable-id]");

  expect(droppableItem).toBeInTheDocument();
});

test("Fields List renders input", () => {
  render(
    <Container>
      <FieldsList
        droppableId="droppableId"
        elements={selectedElements1}
        isDropDisabled
      />
    </Container>
  );
  const input = screen.getByTestId("textInput");

  expect(input).toBeInTheDocument();
});

test("Fields List with no selected items is rendered", () => {
  render(
    <Container>
      <FieldsList droppableId="droppableId" elements={[]} isDropDisabled />
    </Container>
  );
  const fieldsList = screen.getByRole("list");

  expect(fieldsList).toBeInTheDocument();
});

test("Fields List with no selected items is rendered with center aligned children", () => {
  render(
    <Container>
      <FieldsList droppableId="droppableId" elements={[]} isDropDisabled />
    </Container>
  );
  const fieldsList = screen.getByRole("list");

  expect(fieldsList).toHaveClass("justify-center");
});

test("Fields List with no selected items is rendered with top aligned children", () => {
  render(
    <Container>
      <FieldsList
        droppableId="droppableId"
        elements={selectedElements1}
        isDropDisabled
      />
    </Container>
  );
  const fieldsList = screen.getByRole("list");

  expect(fieldsList).toHaveClass("justify-start");
});

test("Fields List with multiple selected items is rendered", () => {
  render(
    <Container>
      <FieldsList
        droppableId="droppableId"
        elements={selectedElements2}
        isDropDisabled
      />
    </Container>
  );
  const fieldsList = screen.getByRole("list");
  expect(fieldsList).toBeInTheDocument();

  const labels = screen.getAllByTestId("textInput");
  expect(labels).toHaveLength(selectedElements2.length);
});
