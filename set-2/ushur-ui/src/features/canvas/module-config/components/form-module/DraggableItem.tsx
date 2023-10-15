import { ReactNode } from "react";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";

type DraggableItemProps = {
  children?: ReactNode;
  draggableId: string;
  index: number;
  render?: (snapshot: DraggableStateSnapshot | null) => ReactNode;
  clone?: boolean;
};

const DraggableItem = (props: DraggableItemProps) => {
  const { children, draggableId, index, render, clone = true } = props;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(dgProvided, snapshot) => (
        <>
          <div
            ref={dgProvided.innerRef}
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...dgProvided.draggableProps}
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...dgProvided.dragHandleProps}
            style={{
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              ...dgProvided.draggableProps.style,
              transform: snapshot.isDragging
                ? dgProvided.draggableProps.style?.transform
                : "translate(0px, 0px)",
            }}
          >
            {render ? render(snapshot) : children}
          </div>
          {snapshot.isDragging && (
            <div
              style={{
                visibility: clone ? "visible" : "hidden",
                transform: "none !important",
              }}
            >
              {render ? render(null) : children}
            </div>
          )}
        </>
      )}
    </Draggable>
  );
};

export default DraggableItem;
