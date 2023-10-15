import { useEffect, useRef } from "react";
import { Workflow } from "../../../api";
import { Module } from "../interfaces/api";
import { DiagramCellId } from "../interfaces/diagramming-service";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updateModuleAsync } from "../data/canvasAsyncRequests";
import {
  isInspectorOpened,
  selectedCellId,
  selectedModule,
  setSelectedCell,
  setSelectedModule,
  workflowDetails,
} from "../data/canvasSlice";

const useReloadInspector = () => {
  const dispatch = useAppDispatch();
  const currentWorkflowDetails = useAppSelector<Workflow | null>(
    workflowDetails
  );
  const isInspectorOpen = useAppSelector(isInspectorOpened);
  const currentSelectedModule = useAppSelector(selectedModule);
  const currentSelectedCellId = useAppSelector(selectedCellId);
  const prevModuleRef = useRef<Module>();
  const prevSelectedCellIdRef = useRef<DiagramCellId>();

  useEffect(() => {
    if (currentSelectedModule) {
      prevModuleRef.current = currentSelectedModule;
    }
  }, [currentSelectedModule]);

  useEffect(() => {
    if (currentSelectedCellId)
      prevSelectedCellIdRef.current = currentSelectedCellId;
  }, [currentSelectedCellId]);

  useEffect(() => {
    if (!isInspectorOpen && currentWorkflowDetails && currentSelectedModule) {
      dispatch(
        updateModuleAsync({
          workflow: currentWorkflowDetails,
          stepId: currentSelectedCellId as string,
          module: currentSelectedModule,
        })
      ).catch(() => {
        throw new Error("Unable to update module");
      });
      dispatch(setSelectedCell(null));
      dispatch(setSelectedModule(null));
    }
  }, [isInspectorOpen]);

  useEffect(() => {
    if (
      isInspectorOpen &&
      prevSelectedCellIdRef.current &&
      !currentSelectedModule &&
      currentWorkflowDetails
    ) {
      dispatch(
        updateModuleAsync({
          workflow: currentWorkflowDetails,
          stepId: prevSelectedCellIdRef.current as string,
          module: prevModuleRef.current as Module,
        })
      ).catch(() => {
        throw new Error("Unable to update module");
      });
    }
  }, [isInspectorOpen, currentSelectedModule, currentSelectedCellId]);
};

export default useReloadInspector;
