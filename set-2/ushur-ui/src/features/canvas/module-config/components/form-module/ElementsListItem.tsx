import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faQuestion, faGripDots } from "@fortawesome/pro-thin-svg-icons";
import { elementIcons } from "./elements";
import DraggableItem from "./DraggableItem";
import { FormElement } from "../../../../../api";

interface ElementsListItemProps extends Pick<FormElement, "name"> {
  draggableId: string | undefined;
  text: string | undefined;
  index: number;
}

const ElementsListItem = (props: ElementsListItemProps) => {
  const { draggableId, text, name, index } = props;
  const nameString = name ?? "";
  const icon = elementIcons[nameString] || (faQuestion as IconProp);

  return (
    <div className="w-1/3" role="listitem">
      <DraggableItem
        draggableId={draggableId ?? ""}
        index={index}
        render={(snapshot) => (
          <div
            className="flex flex-row items-center cursor-pointer p-2 mr-2 mb-2 rounded-md whitespace-nowrap element"
            data-dragging-over={snapshot?.draggingOver}
          >
            {snapshot?.draggingOver === "selectedElements" ? (
              <FontAwesomeIcon icon={faGripDots as IconProp} size="lg" />
            ) : (
              <FontAwesomeIcon icon={icon} size="lg" />
            )}
            <div className="ml-2.5">
              <p className="text-gray-500 m-0">{text}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ElementsListItem;
