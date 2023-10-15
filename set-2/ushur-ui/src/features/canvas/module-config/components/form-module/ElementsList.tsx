import { ReactNode } from "react";
import { FormElement } from "../../../../../api";
import DroppableItem from "./DroppableItem";
import ElementsListItem from "./ElementsListItem";

type ElementsListProps = {
  children?: ReactNode;
  droppableId: string | undefined;
  isDropDisabled: boolean;
  elements: FormElement[];
};

const ElementsList = (props: ElementsListProps) => {
  const { children, droppableId, isDropDisabled, elements } = props;

  return (
    <DroppableItem
      droppableId={droppableId ?? ""}
      isDropDisabled={isDropDisabled}
    >
      <div className="flex flex-row flex-wrap" role="list">
        {elements.map((element, index) => (
          <ElementsListItem
            key={element.id}
            draggableId={element.id ?? ""}
            text={element.title ?? ""}
            name={element.name ?? ""}
            index={index}
          />
        ))}
        {children}
      </div>
    </DroppableItem>
  );
};

export default ElementsList;
