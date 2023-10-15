import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faQuestionSquare,
  faChevronDown,
  faXmark,
  faAngleLeft,
  faFaceSmile,
} from "@fortawesome/pro-thin-svg-icons";
import ModuleList from "../module-config/ModuleConfiguration";
import ModuleDetail from "../module-config/ModuleDetail";
import { DiagramCell } from "../interfaces/diagramming-service";
import {
  setInspectorOpened,
  selectedModule,
  setSelectedModule,
  selectedCellId,
  workflowDetails,
} from "../data/canvasSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Workflow } from "../../../api";
import { updateModuleAsync } from "../data/canvasAsyncRequests";
import InspectorTitle from "./InspectorTitle";

const faQuestionIcon = faQuestionSquare as IconProp;
const faxMarkProp = faXmark as IconProp;
const faChevronDownProp = faChevronDown as IconProp;
const faBackStepIcon = faAngleLeft as IconProp;
const faFaceSmileIcon = faFaceSmile as IconProp;

interface Props {
  cell: DiagramCell;
}

export const cellProps = {
  label: ["attrs", "label", "text"],
  description: ["attrs", "description", "text"],
  icon: ["attrs", "icon", "xlinkHref"],
  portLabel: ["attrs", "portLabel", "text"],
};

const StepInspector = (props: Props): ReactElement => {
  const { cell } = props;

  const dispatch = useAppDispatch();
  const currentSelectedModule = useAppSelector(selectedModule);
  const currentSelectedCellId = useAppSelector(selectedCellId);
  const currentWorkflowDetails = useAppSelector(workflowDetails);

  const getInspectorHeader = () => (
    <div
      className="flex flex-row pl-3 pr-3 pt-3 items-start"
      data-testid="step-inspector-header"
    >
      <div className="flex rounded flex-row items-center px-2 py-2 border-[1px] border-solid border-primary-gray">
        {currentSelectedModule ? (
          <FontAwesomeIcon
            title="Smile Icon"
            className="cursor-pointer text-2xl"
            icon={faFaceSmileIcon}
          />
        ) : (
          <FontAwesomeIcon
            title="Question Mark"
            className="cursor-pointer text-2xl"
            icon={faQuestionIcon}
          />
        )}
        <FontAwesomeIcon
          title="Dropdown Chevron"
          className="cursor-pointer text-base ml-2"
          icon={faChevronDownProp}
        />
      </div>

      <InspectorTitle cell={cell} />

      <FontAwesomeIcon
        title="Close Inspector"
        className="cursor-pointer ml-auto mt-2 mr-1 text-2xl"
        icon={faxMarkProp}
        onClick={() => {
          dispatch(setInspectorOpened(false));
        }}
      />
    </div>
  );

  const getInspectorBody = () => (
    <div className="pt-3" data-testid="step-inspector-body">
      {currentSelectedModule ? (
        <>
          <div
            aria-hidden="true"
            className="flex flex-row pl-3 pr-3  items-center cursor-pointer text-blue-500"
            onClick={() => {
              if (currentSelectedCellId) {
                dispatch(
                  updateModuleAsync({
                    workflow: currentWorkflowDetails as Workflow,
                    stepId: currentSelectedCellId as string,
                    module: currentSelectedModule,
                  })
                ).catch(() => {
                  throw new Error("Unable to update module");
                });
              }
              dispatch(setSelectedModule(null));
            }}
          >
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faBackStepIcon}
              title="Back to module list"
            />
            <p className="not-italic text-sm mb-0 ml-2.5">
              Back to module list
            </p>
          </div>
          <ModuleDetail />
        </>
      ) : (
        <ModuleList />
      )}
    </div>
  );
  return (
    <>
      {getInspectorHeader()}
      {getInspectorBody()}
    </>
  );
};

export default StepInspector;
