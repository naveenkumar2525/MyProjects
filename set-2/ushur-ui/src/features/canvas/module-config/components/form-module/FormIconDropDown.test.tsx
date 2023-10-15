import { ReactNode } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render, fireEvent, waitFor } from "../../../../../utils/test.utils";
import DroppableItem from "./DroppableItem";
import { formElements } from "./elements";
import FieldsListItem from "./FieldsListItem";

const selectedElements1 = [formElements[1]];

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

const Component = () => (
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

let containerObj: Element;

beforeEach(() => {
  const { container } = render(<Component />);

  containerObj = container;
});

test("should contain the ellipsis icon", () => {
  const ele = containerObj.querySelector(".ushur-dropdown");
  expect(ele).toBeInTheDocument();
});

test("should contain Projects dropdown", () => {
  const ele = containerObj.querySelector(".fa-ellipsis-vertical");
  expect(ele).toBeInTheDocument();
});

test("should contain the toggle menu item", () => {
  const DropdownToggle = containerObj?.querySelector(".dropdown-toggle");
  fireEvent.click(DropdownToggle as Element);
  const ele = containerObj.querySelector(".fa-toggle-off");
  expect(ele).toBeInTheDocument();
});

test("should contain the floppy disk item", () => {
  const DropdownToggle = containerObj.querySelector(".dropdown-toggle");
  fireEvent.click(DropdownToggle as Element);
  const ele = containerObj.querySelector(".fa-floppy-disk");
  expect(ele).toBeInTheDocument();
});
test("should contain the trash can item", () => {
  const DropdownToggle = containerObj.querySelector(".dropdown-toggle");
  fireEvent.click(DropdownToggle as Element);
  const ele = containerObj.querySelector(".fa-trash-can");
  expect(ele).toBeInTheDocument();
});
test("should open dropdown with three options", async () => {
  const DropdownToggle = containerObj.querySelector(".dropdown-toggle");
  fireEvent.click(DropdownToggle as Element);
  const showDropdown = await waitFor(() =>
    containerObj.querySelector(".show.dropdown")
  );
  expect(showDropdown).toBeInTheDocument();
  expect(containerObj.querySelectorAll(".dropdown-item")).toHaveLength(3);
});
