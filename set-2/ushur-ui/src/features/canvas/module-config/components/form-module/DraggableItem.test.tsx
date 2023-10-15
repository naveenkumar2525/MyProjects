import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render, screen, fireEvent } from "../../../../../utils/test.utils";
import DroppableItem from "./DroppableItem";
import DraggableItem from "./DraggableItem";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <DroppableItem droppableId="droppableId" isDropDisabled={false}>
        {children}
      </DroppableItem>
    </DragDropContext>
  );
};

test("Draggable Item is rendered", () => {
  render(
    <Container>
      <DraggableItem draggableId="draggableId" index={0}>
        <div>Draggable Item</div>
      </DraggableItem>
    </Container>
  );
  const draggableItem = screen.getByRole("button");

  expect(draggableItem).toBeInTheDocument();
});

test("Multiple Draggable Items are rendered", () => {
  render(
    <Container>
      <DraggableItem draggableId="draggableId1" index={0}>
        <div>Draggable Item 1</div>
      </DraggableItem>

      <DraggableItem draggableId="draggableId2" index={1}>
        <div>Draggable Item 2</div>
      </DraggableItem>
    </Container>
  );
  const draggableItem1 = screen.getByText("Draggable Item 1");
  const draggableItem2 = screen.getByText("Draggable Item 2");

  expect(draggableItem1).toBeInTheDocument();
  expect(draggableItem2).toBeInTheDocument();
});

test("Draggable Item is dragged", () => {
  render(
    <Container>
      <DraggableItem draggableId="draggableId" index={0}>
        <div>Draggable Item</div>
      </DraggableItem>
    </Container>
  );
  const draggableItem = screen.getByRole("button");

  const beforeDrag = draggableItem.getAttribute("style");
  expect(beforeDrag).toEqual("transform: translate(0px, 0px);");

  fireEvent.mouseDown(draggableItem, { clientX: 0, clientY: 0 });

  draggableItem.getBoundingClientRect = jest.fn(() => ({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
    toJSON: () => {},
  }));

  fireEvent.mouseMove(draggableItem, { clientX: 100, clientY: 100 });

  const duringDrag = draggableItem.getAttribute("style");
  expect(duringDrag).toEqual(
    "position: fixed; " +
      "top: 100px; left: 100px; " +
      "box-sizing: border-box; width: 0px; height: 0px; " +
      "transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1); " +
      "z-index: 5000; pointer-events: none;"
  );

  fireEvent.mouseUp(draggableItem);

  const afterDrag = draggableItem.getAttribute("style");
  expect(afterDrag).toEqual("transform: translate(0px, 0px);");
});

test("Draggable Item with render prop is rendered", () => {
  render(
    <Container>
      <DraggableItem
        draggableId="draggableId"
        index={0}
        render={() => <div>Draggable Item</div>}
      />
    </Container>
  );
  const draggableItem = screen.getByRole("button");

  expect(draggableItem).toBeInTheDocument();
});

test("Draggable Item with children and render prop is rendered", () => {
  render(
    <Container>
      <DraggableItem
        draggableId="draggableId"
        index={0}
        render={() => <div>Draggable Item Render</div>}
      >
        <div>Draggable Item Children</div>
      </DraggableItem>
    </Container>
  );
  const draggableItem = screen.getByRole("button");

  expect(draggableItem).toBeInTheDocument();
});

test("Draggable Item render prop should take precedence over children", () => {
  render(
    <Container>
      <DraggableItem
        draggableId="draggableId"
        index={0}
        render={() => <div>Draggable Item Render</div>}
      >
        <div>Draggable Item Children</div>
      </DraggableItem>
    </Container>
  );
  const draggableItem = screen.getByText("Draggable Item Render");

  expect(draggableItem).toBeInTheDocument();
});
