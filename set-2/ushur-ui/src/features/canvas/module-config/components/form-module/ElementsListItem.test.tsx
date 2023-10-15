import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render, screen } from "../../../../../utils/test.utils";
import DroppableItem from "./DroppableItem";
import { staticElements, formElements } from "./elements";
import ElementsListItem from "./ElementsListItem";

type ContainerProps = {
  children: ReactNode;
};

const Container = (props: ContainerProps) => {
  const { children } = props;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <DroppableItem droppableId="droppableId" isDropDisabled={false}>
        <div className="flex flex-row flex-wrap" role="list">
          {children}
        </div>
      </DroppableItem>
    </DragDropContext>
  );
};

test("Static Elements List Items are rendered", () => {
  render(
    <Container>
      {staticElements.map((element, index) => (
        <ElementsListItem
          key={element.id}
          draggableId={element.id ?? ""}
          text={element.title ?? ""}
          name={element.name}
          index={index}
        />
      ))}
    </Container>
  );
  const elementsList = screen.getAllByRole("listitem");

  expect(elementsList).toHaveLength(staticElements.length);
});

test("Form Elements List Items are rendered", () => {
  render(
    <Container>
      {formElements.map((element, index) => (
        <ElementsListItem
          key={element.id}
          draggableId={element.id}
          text={element.title}
          name={element.name}
          index={index}
        />
      ))}
    </Container>
  );
  const elementsList = screen.getAllByRole("listitem");

  expect(elementsList).toHaveLength(formElements.length);
});

test("Elements List Item implements Draggable Item", () => {
  render(
    <Container>
      {staticElements.map((element, index) => (
        <ElementsListItem
          key={element.id}
          draggableId={element.id}
          text={element.title}
          name={element.name}
          index={index}
        />
      ))}
    </Container>
  );
  const elementsList = screen.getAllByRole("button");

  expect(elementsList).toHaveLength(staticElements.length);
});
