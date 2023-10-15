import { ReactElement, useEffect } from "react";
import "./CanvasPage.css";
import DropDown from "./canvasDropDown";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CanvasButton from "./components/CanvasButton";
import {
  isPublished,
  setIsPublished,
  workflowDetails,
} from "./data/canvasSlice";
import {
  deactivateWorkAsync,
  activateWorkAsync,
} from "./data/canvasAsyncRequests";
import { Workflow } from "../../api";

interface TopMenuProps {
  onClick: () => void;
}

const CanvasTopMenu = ({ onClick }: TopMenuProps): ReactElement => {
  const dispatch = useAppDispatch();
  const isPublishedOn = useAppSelector(isPublished);
  const currentWorkflowDetails = useAppSelector(workflowDetails);
  const postPublishedAsync = async (): Promise<void> => {
    if (isPublishedOn) {
      await dispatch(
        deactivateWorkAsync({ workflow: currentWorkflowDetails as Workflow })
      )
        .unwrap()
        .catch((_err) => {
          throw new Error(`Failed to deactivate workflow`);
        });
    } else {
      await dispatch(
        activateWorkAsync({ workflow: currentWorkflowDetails as Workflow })
      )
        .unwrap()
        .catch((_err) => {
          throw new Error(`Failed to activate workflow`);
        });
    }
  };
  useEffect(() => {
    if (currentWorkflowDetails?.ui.active) {
      dispatch(setIsPublished(currentWorkflowDetails?.ui.active));
    }
  }, [currentWorkflowDetails?.ui.active]);

  return (
    <>
      <div
        className="w-[fit-content] flex absolute z-40 top-11 left-2/4 w-full text-white 
        -translate-x-2/4 -translate-y-2/4 "
      >
        <CanvasButton
          text="Test Workflow"
          className="rounded-[4px] bg-gradient-to-br from-[#2F80ED] to-[#8A69FF] writeRead shadow"
          icon="fa-mobile"
          onClick={onClick}
        />
        <DropDown />
        <CanvasButton
          text={isPublishedOn ? "Published" : "Unpublished"}
          className={`ml-2 rounded-[24px] bg-white shadow ${
            isPublishedOn
              ? "border-[1px] border-[#6FCF97] text-black canvas-published"
              : "text-gray-500 canvas-unpublished"
          }`}
          icon={isPublishedOn ? "fa-circle-check" : "fa-face-sleeping"}
          onClick={() => postPublishedAsync()}
        />
      </div>
    </>
  );
};
export default CanvasTopMenu;
