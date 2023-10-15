import { ReactNode } from "react";
import { FormElement } from "../../../../../api";
import useElementsHook from "../../../custom-hooks/useElementsHook";
import DroppableItem from "./DroppableItem";
import FieldsListItem from "./FieldsListItem";

type FieldsListProps = {
  children?: ReactNode;
  droppableId: string;
  isDropDisabled: boolean;
  elements: FormElement[];
};

const FieldsList = (props: FieldsListProps) => {
  const { updateElementInfo } = useElementsHook();
  const { children, droppableId, isDropDisabled, elements } = props;

  const updateElementData = (
    value: string,
    draggableId: string | undefined
  ) => {
    updateElementInfo(elements, draggableId, value);
  };

  return (
    <DroppableItem droppableId={droppableId} isDropDisabled={isDropDisabled}>
      <div
        className={`flex flex-column flex-wrap ${
          elements.length > 0 ? "justify-start" : "justify-center"
        } min-h-[180px]`}
        role="list"
      >
        {elements.map((element, index) => (
          <FieldsListItem
            key={element.id}
            draggableId={element.id ?? ""}
            name={element.name}
            index={index}
            title={element.title ?? ""}
            data={element.data}
            updateElement={updateElementData}
            zIndex={elements.length - index}
          />
        ))}
        {children}
      </div>
    </DroppableItem>
  );
};

export default FieldsList;
