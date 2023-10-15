import React, { useRef, useState, useCallback } from "react";
import { faQuotes } from "fontawesome-pro-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ContentEditableEvent } from "react-contenteditable";
import FormIconDropDown from "./FormIconDropDown";
import { elementFields, staticElementFields } from "./elements";
import DraggableItem from "./DraggableItem";
import TagsProvider from "../../../tags/Provider";
import TagSelectionDropdown from "../../../tags/TagSelectionDropdown/TagSelectionDropdown";
import "./FormIconDropDown.css";
import { FormElement, FormTextInput } from "../../../../../api";

interface FieldsListItemProps extends Pick<FormElement, "name"> {
  draggableId?: string;
  index: number;
  title?: string;
  data?: FormTextInput;
  updateElement: (value: string, elementId: string | undefined) => void;
  zIndex?: number;
}

const interactiveTagNames = [
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "optgroup",
  "video",
  "audio",
];

const FieldsListItem = (props: FieldsListItemProps) => {
  const { draggableId, name, index, title, data, updateElement, zIndex } =
    props;
  const [longPressed, setLongPressed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const nameString = name ?? "";
  const Field = elementFields[nameString]
    ? elementFields[nameString]
    : staticElementFields[nameString];

  const handleLongPressStart = useCallback(
    (
      event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      const element = event.target as HTMLElement;
      const tagName = (element?.tagName || "").toLowerCase();

      if (!interactiveTagNames.includes(tagName)) {
        timerRef.current = setTimeout(() => {
          setLongPressed(true);
        }, 300);
      }
    },
    []
  );

  const handleLongPressEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      setLongPressed(false);
    }
  }, []);

  return (
    <div
      className="w-100 position-relative"
      role="listitem"
      style={{
        zIndex,
      }}
    >
      <DraggableItem
        draggableId={draggableId ?? ""}
        index={index}
        clone={false}
        render={(snapshot) => (
          <div
            aria-hidden="true"
            className="field-container pl-2 pr-2 pb-2"
            data-long-pressed={longPressed}
            data-dragging-over={snapshot?.draggingOver}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
          >
            {Field && (
              <TagsProvider>
                <div className="formMenu-container">
                  <Field
                    label={title}
                    value={data?.fieldValue}
                    defaultValue={data?.fieldValue}
                    onChange={(event: ContentEditableEvent) => {
                      updateElement(event?.target?.value, draggableId);
                    }}
                    onFormEditorChange={(value: string) => {
                      updateElement(value, draggableId);
                    }}
                    labelIcon={faQuotes as IconProp}
                  />
                  <div className="position-relative">
                    <TagSelectionDropdown />
                  </div>
                  <FormIconDropDown maxWidth="100%" />
                </div>
              </TagsProvider>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default FieldsListItem;
