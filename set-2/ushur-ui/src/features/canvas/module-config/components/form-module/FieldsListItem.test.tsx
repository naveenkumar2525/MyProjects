import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "../../../../../utils/test.utils";
import DroppableItem from "./DroppableItem";
import { formElements } from "./elements";
import FieldsListItem from "./FieldsListItem";

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

  return (
    <DragDropContext onDragEnd={() => {}}>
      <DroppableItem droppableId="droppableId" isDropDisabled={false}>
        <div
          className="flex flex-column flex-wrap justify-start min-h-[180px]"
          role="list"
        >
          {children}
        </div>
      </DroppableItem>
    </DragDropContext>
  );
};

test("Fields List Item is rendered", () => {
  render(
    <Container>
      {selectedElements1.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );
  const fieldsList = screen.getAllByRole("listitem");

  expect(fieldsList).toHaveLength(selectedElements1.length);
});

test("Fields List Items are rendered", () => {
  render(
    <Container>
      {selectedElements2.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );
  const fieldsList = screen.getAllByRole("listitem");

  expect(fieldsList).toHaveLength(selectedElements2.length);
});

test("Fields List Item implements Draggable Item", () => {
  render(
    <Container>
      {selectedElements1.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );
  const fieldsList = screen.getAllByRole("button");

  expect(fieldsList).toHaveLength(selectedElements1.length);
});

test("Fields List Item content is rendered in a interactive container", () => {
  render(
    <Container>
      {selectedElements1.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );
  const wrapper = screen
    .getByTestId("textInput")
    .closest('div[aria-hidden="true"]');

  expect(wrapper).toBeInTheDocument();
});

test("Fields List Item long pressed attribute is changed after long press", async () => {
  render(
    <Container>
      {selectedElements1.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );

  await waitFor(async () => {
    const wrapper = screen
      .getByTestId("textInput")
      .closest('div[aria-hidden="true"]');

    if (!wrapper) {
      throw new Error("Element not found");
    }

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.getAttribute("data-long-pressed")).toEqual("false");

    fireEvent.mouseDown(wrapper);
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(wrapper?.getAttribute("data-long-pressed")).toEqual("true");
  });
});

test("Fields List Item long press is activated only after 300ms", async () => {
  render(
    <Container>
      {selectedElements1.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );

  await waitFor(async () => {
    const wrapper = screen
      .getByTestId("textInput")
      .closest('div[aria-hidden="true"]');

    if (!wrapper) {
      throw new Error("Element not found");
    }

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.getAttribute("data-long-pressed")).toEqual("false");

    fireEvent.mouseDown(wrapper);
    await new Promise((resolve) => setTimeout(resolve, 299));
    fireEvent.mouseUp(wrapper);

    expect(wrapper.getAttribute("data-long-pressed")).toEqual("false");
  });
});

test("Fields List Item renders input element", () => {
  render(
    <Container>
      {selectedElements1.map((element, index) => (
        <FieldsListItem
          key={element.id}
          draggableId={element.id}
          name={element.name}
          index={index}
          title=""
          data={undefined}
          updateElement={() => "Update Element Data"}
        />
      ))}
    </Container>
  );
  const input = screen.getByTestId("textInput");
  expect(input).toBeInTheDocument();
});
