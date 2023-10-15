import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPencil } from "@fortawesome/pro-solid-svg-icons";
import { notifyToast } from "@ushurengg/uicomponents";
import { useAppSelector } from "../../../app/hooks";
import { DiagramCell } from "../interfaces/diagramming-service";
import { isInspectorOpened } from "../data/canvasSlice";

import InspectorTitleForm from "./InspectorTitleForm";

const faPencilIcon = faPencil as IconProp;
interface Props {
  cell: DiagramCell;
}

export const cellProps = {
  label: ["attrs", "label", "text"],
  description: ["attrs", "description", "text"],
  icon: ["attrs", "icon", "xlinkHref"],
  portLabel: ["attrs", "portLabel", "text"],
};

const InspectorTitle = (props: Props): ReactElement => {
  const { cell } = props;
  const [label, setLabel] = useState<string>("New Step");
  const [checkLabel, setCheckLabel] = useState<{ [key: string]: boolean }>({});
  const [allLabel, setAllLabel] = useState<{ [key: string]: string }>({});
  const [description, setDescription] = useState<string>("No Description");
  const [checkDescription, setCheckDescription] = useState<{
    [key: string]: boolean;
  }>({});
  const [allDescription, setAllDescription] = useState<{
    [key: string]: string;
  }>({});
  const isInspectorOpen = useAppSelector(isInspectorOpened);

  useEffect(() => {
    if (!allLabel[label]) {
      setAllLabel({ ...allLabel, [label]: label });
    }
    setCheckLabel({ ...checkLabel, [cell.getId()]: false });
  }, [label, isInspectorOpen, cell.getId()]);
  useEffect(() => {
    if (!allDescription[description]) {
      setAllDescription({ ...allDescription, [description]: description });
    }
    setCheckDescription({ ...checkDescription, [cell.getId()]: false });
  }, [description, isInspectorOpen, cell.getId()]);
  useEffect((): void => {
    if (!cell) {
      return;
    }
    setLabel(cell.getValue(cellProps.label));
    setAllLabel({ [label]: "" });
    setDescription(cell.getValue(cellProps.description));
  }, [cell]);

  const descriptionFn = () => {
    setCheckLabel({ [cell.getId()]: false });
    return setCheckDescription({ [cell.getId()]: true });
  };
  const labelFn = () => {
    if (label === "Welcome!") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      notifyToast({
        variant: "warning",
        text: "Note",
        subText: "The Welcome! step title cannot be edited.",
        animation: true,
      });
    }
    setCheckDescription({ [cell.getId()]: false });
    return setCheckLabel({ [cell.getId()]: true });
  };
  return (
    <>
      <div>
        {checkLabel[cell.getId()] && label !== "Welcome!" ? (
          <InspectorTitleForm
            cell={cell}
            item={label}
            setItem={setLabel}
            setCheck={setCheckLabel}
            allItems={allLabel}
            setAllItems={setAllLabel}
            text="label"
          />
        ) : (
          <button
            type="button"
            onClick={() => labelFn()}
            className="flex group cursor-pointer"
            onKeyDown={(e) => e.key === "Enter" && labelFn()}
          >
            <p
              className="flex justify-start items-center w-[20.25rem] font-proxima-bold text-2xl text-dark-blue ml-2.5 
                border-[1px] border-solid p-[0.1rem] pl-4 pr-8 border-transparent hover:border-primary-gray pl-2 mb-[0px]"
              aria-label="label-button"
            >
              <div className="inline-block break-words text-left w-[17.5rem]">
                {label}
              </div>
              <FontAwesomeIcon
                title="Pencil-label"
                className="text-blue text-xs ml-2 hidden group-hover:block "
                icon={faPencilIcon}
                aria-label="label-pencil"
              />
            </p>
          </button>
        )}

        {checkDescription[cell.getId()] ? (
          <span>
            {" "}
            <InspectorTitleForm
              cell={cell}
              item={description}
              setItem={setDescription}
              setCheck={setCheckDescription}
              allItems={allDescription}
              setAllItems={setAllDescription}
              text="description"
            />
          </span>
        ) : (
          <button
            className="flex group  cursor-pointer description"
            onClick={() => descriptionFn()}
            onKeyDown={(e) => e.key === "Enter" && descriptionFn()}
            type="button"
          >
            <p
              aria-label="description-button"
              className="flex justify-start items-center w-[20.25rem] font-proxima-light text-xs text-light-gray ml-2.5 
      border-[1px] border-solid p-[0.5rem] pr-8 border-transparent hover:border-primary-gray pl-4"
            >
              <div className="inline-block break-words text-left w-[17.5rem]">
                {description}
              </div>
              <FontAwesomeIcon
                title="Pencil-description"
                className="text-blue text-xs ml-2 hidden group-hover:block"
                icon={faPencilIcon}
                aria-label="description-pencil"
              />
            </p>
          </button>
        )}
      </div>
    </>
  );
};

export default InspectorTitle;
