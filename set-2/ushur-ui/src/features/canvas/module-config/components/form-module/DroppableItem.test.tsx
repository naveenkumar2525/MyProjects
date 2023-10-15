import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render, screen } from "../../../../../utils/test.utils";
import DroppableItem from "./DroppableItem";
import DraggableItem from "./DraggableItem";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return <DragDropContext onDragEnd={() => {}}>{children}</DragDropContext>;
};

test("Droppable Item with drop disabled is rendered", () => {
  render(
    <Container>
      <DroppableItem droppableId="droppableId" isDropDisabled={false}>
        <div>Droppable Item</div>
      </DroppableItem>
    </Container>
  );
  const droppableItem = screen.getByText("Droppable Item");

  expect(droppableItem).toBeInTheDocument();
});

test("Droppable Item with drop enabled is rendered", () => {
  render(
    <Container>
      <DroppableItem droppableId="droppableId" isDropDisabled>
        <div>Droppable Item</div>
      </DroppableItem>
    </Container>
  );
  const droppableItem = screen.getByText("Droppable Item");

  expect(droppableItem).toBeInTheDocument();
});

test("Multiple Droppable Items are rendered", () => {
  render(
    <Container>
      <DroppableItem droppableId="droppableId1" isDropDisabled>
        <div>Droppable Item 1</div>
      </DroppableItem>
      <DroppableItem droppableId="droppableId2" isDropDisabled>
        <div>Droppable Item 2</div>
      </DroppableItem>
    </Container>
  );
  const droppableItem1 = screen.getByText("Droppable Item 1");
  const droppableItem2 = screen.getByText("Droppable Item 2");

  expect(droppableItem1).toBeInTheDocument();
  expect(droppableItem2).toBeInTheDocument();
});

test("Droppable Item with Draggable Item is rendered", () => {
  render(
    <Container>
      <DroppableItem droppableId="droppableId" isDropDisabled>
        <DraggableItem draggableId="draggableId" index={0}>
          <div>Draggable Item</div>
        </DraggableItem>
      </DroppableItem>
    </Container>
  );
  const draggableItem = screen.getByText("Draggable Item");

  expect(draggableItem).toBeInTheDocument();
});

test("Droppable Item with multiple Draggable Items is rendered", () => {
  render(
    <Container>
      <DroppableItem droppableId="droppableId" isDropDisabled>
        <DraggableItem draggableId="draggableId1" index={0}>
          <div>Draggable Item 1</div>
        </DraggableItem>
        <DraggableItem draggableId="draggableId2" index={1}>
          <div>Draggable Item 2</div>
        </DraggableItem>
      </DroppableItem>
    </Container>
  );
  const draggableItem1 = screen.getByText("Draggable Item 1");
  const draggableItem2 = screen.getByText("Draggable Item 2");

  expect(draggableItem1).toBeInTheDocument();
  expect(draggableItem2).toBeInTheDocument();
});
