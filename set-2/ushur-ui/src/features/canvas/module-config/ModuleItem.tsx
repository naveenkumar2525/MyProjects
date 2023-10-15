import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { notifyToast } from "@ushurengg/uicomponents";
import { Overlay, Tooltip } from "react-bootstrap";
import {
  faMessageSmile,
  faClipboardListCheck,
  faCalculatorSimple,
  faRobot,
  faCodeBranch,
  faListTree,
  faQuestion,
  faTrashCan,
} from "@fortawesome/pro-thin-svg-icons";
import { useRef, useState } from "react";
import {
  selectedCellId,
  setSelectedModule,
  workflowDetails,
} from "../data/canvasSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Module } from "../interfaces/api";
import { delModuleAsync } from "../data/canvasAsyncRequests";
import { Workflow, WorkflowStep } from "../../../api";
import { findStep, isWelcomeStep } from "../data/utils";
import { workflowHasOnlyMessageModules } from "../data/validation";

const MessageIcon = faMessageSmile as IconProp;
const FormIcon = faClipboardListCheck as IconProp;
const ComputeIcon = faCalculatorSimple as IconProp;
const BranchIcon = faCodeBranch as IconProp;
const AIMLIcon = faRobot as IconProp;
const MenuIcon = faListTree as IconProp;
const defaultIcon = faQuestion as IconProp;
interface Props {
  content: Module;
  index: number;
  isConfigured: boolean;
}

const getIcon = (title: string) => {
  const iconMap: Record<string, IconProp> = {
    Message: MessageIcon,
    Menu: MenuIcon,
    Form: FormIcon,
    Compute: ComputeIcon,
    Branch: BranchIcon,
    "AI/ML": AIMLIcon,
  };
  return iconMap[title] ?? defaultIcon;
};
const getConfiguredClassName = (title: string) => {
  const classNameMap: Record<string, string> = {
    Message: "configured-item-blue",
    Menu: "configured-item-blue",
    Form: "configured-item-blue",
    Compute: "configured-item-pink",
    Branch: "configured-item-yellow",
    "AI/ML": "configured-item-grey",
  };
  return classNameMap[title] ?? "";
};

const isDeletionAllowed = (
  workflow: Workflow,
  step: WorkflowStep | undefined,
  index: number
) => {
  if (step && isWelcomeStep(step) && index === 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    notifyToast({
      variant: "warning",
      text: "Note",
      subText: "The first Welcome step module cannot be deleted.",
      animation: true,
    });
    return false;
  }

  if (!workflowHasOnlyMessageModules(workflow)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    notifyToast({
      variant: "warning",
      text: "Note",
      subText:
        // eslint-disable-next-line max-len
        "Coming Soon: The current workflow has modules other than message modules. Support for deleting different types of modules is coming in the near future.",
      animation: true,
    });
    return false;
  }

  return true;
};

const ModuleItem = ({ content, index, isConfigured }: Props) => {
  const dispatch = useAppDispatch();
  const thisIcon = getIcon(content.title);
  const deleteIconTarget = useRef(null);

  const currentWorkflowDetails = useAppSelector<Workflow | null>(
    workflowDetails
  );
  const currentSelectedCellId = useAppSelector(selectedCellId);
  const step = findStep(currentSelectedCellId, currentWorkflowDetails);

  const [isHoveringModuleItem, setIsHoveringModuleItem] =
    useState<boolean>(false);
  const [isHoveringDeleteModuleItem, setIsHoveringDeleteModuleItem] =
    useState<boolean>(false);

  return isConfigured ? (
    <Draggable draggableId={content.id} index={index}>
      {(provided) => (
        <div
          className={`flex flex-row items-center cursor-pointer p-2 m-1 rounded-md ${getConfiguredClassName(
            content.title
          )}`}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...provided.draggableProps}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => {
            if (!isHoveringDeleteModuleItem) {
              dispatch(setSelectedModule(content));
            }
          }}
          onMouseEnter={() => {
            setIsHoveringModuleItem(true);
          }}
          onMouseLeave={() => {
            setIsHoveringModuleItem(false);
          }}
          onKeyDown={() => {}}
          role="presentation"
        >
          <FontAwesomeIcon icon={thisIcon} size="2x" />
          <div className="ml-2.5">
            <p className="non-italic font-proxima-light text-base text-dark-blue m-0">
              {content.title}
            </p>
          </div>
          {isHoveringModuleItem && (
            <span
              onMouseEnter={() => {
                setIsHoveringDeleteModuleItem(true);
              }}
              onMouseLeave={() => {
                setIsHoveringDeleteModuleItem(false);
              }}
              role="button"
              tabIndex={0}
              className="ml-auto"
              onClick={() => {
                if (!currentWorkflowDetails) {
                  throw new Error("Expecting workflow to exist");
                }

                if (!isDeletionAllowed(currentWorkflowDetails, step, index)) {
                  return;
                }

                dispatch(
                  delModuleAsync({
                    workflow: currentWorkflowDetails,
                    stepId: currentSelectedCellId as string,
                    module: content,
                  })
                )
                  .unwrap()
                  .catch(() => {
                    throw new Error("Unable to delete a module");
                  });
              }}
              onKeyDown={() => {}}
            >
              <Overlay target={deleteIconTarget.current} show placement="top">
                <Tooltip id={`delete-module-tooltip-${index}`}>
                  Delete Module
                </Tooltip>
              </Overlay>

              <span ref={deleteIconTarget}>
                <FontAwesomeIcon
                  data-testid="delete-icon"
                  icon={faTrashCan as IconProp}
                  size="1x"
                  color="red"
                />
              </span>
            </span>
          )}
        </div>
      )}
    </Draggable>
  ) : (
    <Draggable draggableId={content.id} index={index}>
      {(provided, snapshot) => (
        <>
          <div
            className={`flex flex-row items-center cursor-pointer p-2 m-1 rounded-md ${getConfiguredClassName(
              content.title
            )}`}
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...provided.draggableProps}
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging
                ? provided.draggableProps.style?.transform
                : "translate(0px, 0px)",
            }}
          >
            <FontAwesomeIcon icon={thisIcon} size="lg" />
            <div className="ml-2.5">
              <p className="non-italic font-proxima-light text-base m-0 text-dark-blue">
                {content.title}
              </p>
            </div>
          </div>
          {snapshot.isDragging && (
            <div
              // eslint-disable-next-line spellcheck/spell-checker
              className={`flex flex-row font-proxima-light items-center cursor-pointer p-2 m-1 rounded-md ${getConfiguredClassName(
                content.title
              )}`}
              style={{ transform: "none !important" }}
            >
              <FontAwesomeIcon icon={thisIcon} size="lg" />
              <div className="ml-2.5">
                <p className="non-italic font-proxima-light text-base m-0 text-dark-blue">
                  {content.title}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </Draggable>
  );
};
export default ModuleItem;
