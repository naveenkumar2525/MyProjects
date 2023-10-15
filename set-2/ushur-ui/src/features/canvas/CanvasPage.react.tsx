import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./CanvasPage.css";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import Inspector from "./inspector/Inspector";
import CanvasTopMenu from "./TopCanvasMenu";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setDiagrammingService,
  isInspectorOpened,
  setInspectorOpened,
  workflowDetails,
  diagrammingService,
  setSelectedCell,
  setSelectedModule,
} from "./data/canvasSlice";
import JointJsDiagrammingService from "./diagramming/jointjs/services/jointjs-diagramming-service";
import { DiagrammingEventListeners } from "./interfaces/diagramming-service";
import { useTrackPageLoad } from "../../utils/tracking";
import AddStepMenu, { AddStepMenuOptions } from "./components/AddStepMenu";
import { Workflow, WorkflowLink, WorkflowStep } from "../../api";
import useReloadInspector from "./custom-hooks/useReloadInspector";
import WorkflowDebug from "./debug/WorkflowDebug";
import SimulatorFlyout from "./simulator/SimulatorFlyout.react";
import useImportDiagram from "./custom-hooks/useImportDiagram";
import {
  getWorkflowAsync,
  addCellsToWorkflowAsync,
  deleteCellFromWorkflowAsync,
} from "./data/canvasAsyncRequests";
import Simulator from "../../components/Simulator.react";
import TextConversations from "./simulator/TextConversations.react";
import TextTopSection from "./simulator/TextTopSection.react";
import useGetWorkflowId from "./custom-hooks/useGetWorkflowId";
import ErrorFallback from "../../components/ErrorFallback.react";

const enableDebugWorkflow =
  process.env.REACT_APP_CANVAS2_ENABLE_VIEW_WORKFLOW_JSON === "true";

interface CanvasProps {
  debug: boolean;
  shouldShowPerformanceStats: boolean;
}
const FooterElement = () => <div className="simulator_footer_section" />;
/* eslint max-lines-per-function: ["error", 156] */
function CanvasPage(
  props: CanvasProps = { debug: false, shouldShowPerformanceStats: false }
) {
  const handleError = useErrorHandler();
  const dispatch = useAppDispatch();
  const currentWorkflowDetails = useAppSelector<Workflow | null>(
    workflowDetails
  );
  // Used to ensure that diagramming service callbacks can access the latest workflow state
  const currentWorkflowDetailsRef = useRef<Workflow | null>();
  currentWorkflowDetailsRef.current = currentWorkflowDetails;

  const currentDiagrammingService = useAppSelector(diagrammingService);
  const isInspectorOpen = useAppSelector(isInspectorOpened);

  const [workflowDebugOpen, setWorkflowDebugOpen] = useState(false);
  const workflowId = useGetWorkflowId();

  const { debug, shouldShowPerformanceStats } = props;
  const [showSimulator, setShowSimulator] = useState(false);
  // Used to ensure event handlers see the diagramming service
  const currentDiagrammingServiceRef = useRef(currentDiagrammingService);
  const readOnly = false;
  useTrackPageLoad({ name: "Canvas Page" });
  useImportDiagram();
  useReloadInspector();

  useEffect(() => {
    dispatch(getWorkflowAsync(workflowId))
      .unwrap()
      .catch((err) => {
        handleError(err);
      });
    function initializeDiagrammingService() {
      const diagrammingEventListeners: DiagrammingEventListeners = {
        "blank:pointerdown": () => {
          dispatch(setInspectorOpened(false));
        },
        "element:pointerdown": (selection) => {
          dispatch(setInspectorOpened(true));
          dispatch(setSelectedCell(selection));
          dispatch(setSelectedModule(null));
        },
        "element:pointerdblclick": () => {
          dispatch(setInspectorOpened(false));
        },
        "debug-workflow:pointerclick": () => {
          /* istanbul ignore next */
          setWorkflowDebugOpen(true);
        },
        onClickAddStepBtnInBranch: () => {
          ReactDOM.render(
            <AddStepMenu
              onClickMenu={(option: AddStepMenuOptions) => {
                const currentService = currentDiagrammingServiceRef.current;
                currentService?.onClickAddStepPopupMenu(option);
              }}
            />,
            document.getElementById("add-step-menu-wrapper")
          );
        },
        onAddNewObjects: (cells: Array<WorkflowStep | WorkflowLink>) => {
          if (!currentWorkflowDetailsRef?.current) {
            return;
          }
          dispatch(
            addCellsToWorkflowAsync({
              workflow: currentWorkflowDetailsRef.current,
              cells,
            })
          ).catch((_err) => {
            throw new Error(`Could not add cells to workflow`);
          });
        },
        onRemoveObject: (cell: WorkflowStep | WorkflowLink) => {
          if (!currentWorkflowDetailsRef?.current) {
            return;
          }
          dispatch(
            deleteCellFromWorkflowAsync({
              workflow: currentWorkflowDetailsRef.current,
              cellToDelete: cell,
            })
          ).catch((_err) => {
            throw new Error(`Could not delete cells in workflow`);
          });
        },
      };
      const service = new JointJsDiagrammingService(
        {
          canvas: ".canvas",
          toolbar: ".toolbar-container",
          paper: ".paper-container",
        },
        diagrammingEventListeners,
        enableDebugWorkflow
      );
      dispatch(setDiagrammingService(service));
      currentDiagrammingServiceRef.current = service;
    }
    initializeDiagrammingService();
  }, []);

  return (
    <>
      <div className={`canvas ${readOnly ? "readOnly" : " "}`}>
        <div className="toolbar-container" />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <CanvasTopMenu onClick={() => setShowSimulator(true)} />
        </ErrorBoundary>
        <div className="main-container" style={{ height: "100vh" }}>
          <div className="paper-container" />
        </div>
        {
          /* istanbul ignore next */ enableDebugWorkflow ? (
            <WorkflowDebug
              show={workflowDebugOpen}
              onCancel={() => {
                setWorkflowDebugOpen(false);
              }}
            />
          ) : null
        }
        {
          /* istanbul ignore next */ debug && shouldShowPerformanceStats && (
            <div
              id="canvasInfoMetric"
              className="z-40 absolute left-[calc(40%-400px)] ml-2 top-0.5 pointer-events-none text-base w-1000"
            />
          )
        }
        <div
          style={{
            display: isInspectorOpen ? "initial" : "none",
            zIndex: 60,
          }}
        >
          <Inspector />
          <div className="simulator">
            <SimulatorFlyout
              showSimulator={showSimulator}
              setShowSimulator={setShowSimulator}
            >
              <Simulator
                HeaderElement={TextTopSection}
                BodyElement={TextConversations}
                FooterElement={FooterElement}
              />
            </SimulatorFlyout>
          </div>
        </div>
      </div>
    </>
  );
}
export default CanvasPage;
