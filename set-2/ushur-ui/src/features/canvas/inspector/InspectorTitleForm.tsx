import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faX } from "@fortawesome/pro-solid-svg-icons";
import { toastNotify } from "../data/validation/index";
import { Workflow, WorkflowStep } from "../../../api";
import { workflowDetails } from "../data/canvasSlice";
import { DiagramCell } from "../interfaces/diagramming-service";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import Input from "./InspectorInput";
import { updateCellFromWorkflowAsync } from "../data/canvasAsyncRequests";

const faCheckIcon = faCheck as IconProp;
const faXIcon = faX as IconProp;

interface Props {
  cell: DiagramCell;
  item: string;
  setItem: React.Dispatch<React.SetStateAction<string>>;
  setCheck: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  allItems: { [key: string]: string };
  setAllItems: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  text: string;
}

export const cellProps = {
  label: ["attrs", "label", "text"],
  description: ["attrs", "description", "text"],
};
const InspectorTitle = (props: Props): ReactElement => {
  const { item, setCheck, setItem, cell, setAllItems, allItems, text } = props;
  const workflow = useAppSelector(workflowDetails) as Workflow;
  const dispatch = useAppDispatch();

  const Cancel = () => {
    const string = allItems[item];
    setAllItems({ [string]: item });
    return setCheck({ [cell.getId()]: false });
  };

  const confirm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const word = allItems[item];

    if (!word.trim()) {
      return toastNotify(`The step ${text} cannot be blank.`);
    }
    if (word.trim() === "Welcome!" && text === "label") {
      return toastNotify(`Other steps cannot be named Welcome!.`);
    }
    setItem(allItems[item]);
    cell.setValue(`attrs/${text}/text`, allItems[item]);
    const cellToUpdate: WorkflowStep = cell.getValue("attrs");
    const cellID = cell.getId() as string;
    dispatch(
      updateCellFromWorkflowAsync({
        workflow,
        cellToUpdate,
        cellID,
      })
    )
      .unwrap()
      .catch((_err) => {
        throw new Error(`Failed to update cell`);
      });
    return setCheck({ [cell.getId()]: false });
  };

  return (
    <>
      <form onSubmit={(e) => confirm(e)} className="relative w-full mb-[0px]">
        <Input
          cellId={cell.getId() as string}
          defaultValue={item}
          setCheck={setCheck}
          placeholder={item}
          onChange={(e) =>
            setAllItems({ ...allItems, [e.target.name]: e.target.value })
          }
          className="ml-4 font-proxima-light rounded pl-2.5 pr-[5rem] w-[20rem]"
        />
        <div
          className="flex absolute left-[16.5rem] w-[15%] justify-end align-center
         items-center top-[15%]"
        >
          <button
            className="flex justify-center items-center
            border-solid border-green-500 mr-1 w-[1.5rem] 
            h-[1.5rem] p-[0.05rem] rounded border-[1px]"
            type="submit"
            name="confirm-btn"
            onMouseDown={(e) => e.preventDefault()}
          >
            <FontAwesomeIcon
              name="labelCheck"
              className="text-green-500 text-xs"
              icon={faCheckIcon}
            />
          </button>
          <button
            type="button"
            className="flex justify-center items-center
                border-solid border-[rgb(255,0,0)] w-[1.5rem] 
                h-[1.5rem] p-[0.05rem] rounded border-[1px]"
            onClick={() => Cancel()}
          >
            <FontAwesomeIcon
              className="text-[rgb(255,0,0)] text-xs"
              icon={faXIcon}
            />
          </button>
        </div>
      </form>
    </>
  );
};
export default InspectorTitle;
