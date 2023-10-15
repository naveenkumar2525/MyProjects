import { useHistory } from "react-router-dom";
import "./CanvasPage.css";
import {
  Dropdown as UshurDropdown,
  notifyToast,
} from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faPencil,
  faTrashCan,
  faEarthAmericas,
  faClone,
  faSliders,
  faVial,
} from "@fortawesome/pro-thin-svg-icons";
import { isPublished } from "./data/canvasSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteWorkflowAsync } from "./data/canvasAsyncRequests";
import useGetWorkflowId from "./custom-hooks/useGetWorkflowId";
import { notifyFunctionalityComingSoon } from "./data/validation";

const faPencilIcon = faPencil as IconProp;
const faTrashIcon = faTrashCan as IconProp;
const faEarthAmericasIcon = faEarthAmericas as IconProp;
const faCloneIcon = faClone as IconProp;
const faSlidersIcon = faSliders as IconProp;
const faVialIcon = faVial as IconProp;

function CanvasPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const workflowId = useGetWorkflowId();
  const isPublishedOn = useAppSelector(isPublished);
  return (
    <>
      <UshurDropdown
        actionButton={{
          onClick: () => {
            if (!isPublishedOn) {
              dispatch(deleteWorkflowAsync(workflowId))
                .unwrap()
                .then(() => history.push("/"))
                .catch((_err) => {
                  throw new Error(`Failed to delete workflow`);
                });
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              notifyToast({
                variant: "warning",
                text: "Note",
                subText: "The Workflow cannot be deleted while Published.",
                animation: true,
              });
            }
          },
          text: (
            <span>
              {" "}
              <FontAwesomeIcon
                style={{ background: "transparent" }}
                icon={faTrashIcon}
                className="mr-2 cursor-pointer"
              />
              Delete
            </span>
          ),
        }}
        maxWidth
        options={[
          {
            category: "WorkFlow",
            onClick: () => {
              notifyFunctionalityComingSoon();
            },
            text: (
              <span>
                <FontAwesomeIcon
                  icon={faPencilIcon}
                  className="mr-2 cursor-pointer"
                />{" "}
                Edit
              </span>
            ),
            value: "Edit",
          },
          {
            category: "WorkFlow",
            onClick: () => {
              notifyFunctionalityComingSoon();
            },
            text: (
              <span>
                <FontAwesomeIcon
                  icon={faCloneIcon}
                  className="mr-2 cursor-pointer"
                />
                Clone
              </span>
            ),
            value: "clone",
          },
          {
            category: "WorkFlow",
            onClick: () => {
              notifyFunctionalityComingSoon();
            },
            text: (
              <span>
                <FontAwesomeIcon
                  icon={faVialIcon}
                  className="mr-2 cursor-pointer"
                />
                Versions
              </span>
            ),
            value: "Versions",
          },
          {
            category: "WorkFlow",
            onClick: () => {
              notifyFunctionalityComingSoon();
            },
            text: (
              <span>
                {" "}
                <FontAwesomeIcon
                  icon={faEarthAmericasIcon}
                  className="mr-2 cursor-pointer"
                />
                Language
              </span>
            ),
            value: "Language",
          },
          {
            category: "WorkFlow",
            onClick: () => {
              notifyFunctionalityComingSoon();
            },
            text: (
              <span>
                {" "}
                <FontAwesomeIcon
                  icon={faSlidersIcon}
                  className="mr-2 cursor-pointer"
                />
                Properties
              </span>
            ),
            value: "Properties",
          },
        ]}
        className="w-[fit-content] rounded mt-6 add-data-dropdown flex justify-center items-center last:bg-white"
        showDivider
        title={
          <span role="button" aria-label="Workflow Menu">
            <i className="bi bi-gear canvas-gearDropdown" />
          </span>
        }
        tooltipText="Workflow Menu"
        tooltipText-position="left"
        type="button"
      />
    </>
  );
}

export default CanvasPage;
