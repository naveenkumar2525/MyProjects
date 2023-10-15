import { useEffect } from "react";
import { Workflow } from "../../../api";
import { useAppSelector } from "../../../app/hooks";
import { diagrammingService, workflowDetails } from "../data/canvasSlice";

const useImportDiagram = () => {
  const currentDiagrammingService = useAppSelector(diagrammingService);
  const currentWorkflowDetails = useAppSelector<Workflow | null>(
    workflowDetails
  );
  useEffect(() => {
    if (!currentWorkflowDetails) {
      return undefined;
    }
    if (currentDiagrammingService) {
      if (!currentDiagrammingService.getGraph()) {
        // this is a very important note!
        // load graph only when there is first update of current workflow details, doesn't load from second update
        currentDiagrammingService.start();
        currentDiagrammingService.import(currentWorkflowDetails);
      }
    }
    return undefined;
  }, [currentWorkflowDetails, currentDiagrammingService]);
};

export default useImportDiagram;
