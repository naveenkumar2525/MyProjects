import { ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

type DroppableItemProps = {
  children: ReactNode;
  droppableId: string;
  isDropDisabled: boolean;
};

const DroppableItem = (props: DroppableItemProps) => {
  const { children, droppableId, isDropDisabled } = props;

  return (
    <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
      {(dpProvided) => (
        <>
          <div
            ref={dpProvided.innerRef}
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...dpProvided.droppableProps}
          >
            {children}
            {dpProvided.placeholder}
          </div>
        </>
      )}
    </Droppable>
  );
};

export default DroppableItem;
