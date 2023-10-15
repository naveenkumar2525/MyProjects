import {
  Workflow,
  WorkflowVariables,
  InitUshurResponse,
  ContinueUshurResponse,
  GetVariablesByUeTagResponse,
  GetTagTypesResponse,
  GetTagsResponse,
  GetDatatableTagsResponse,
  MenuOption,
} from "../../../../api";
import { Module } from "../api";
import { DiagramCellId, DiagrammingService } from "../diagramming-service";
import { ModuleDetails } from "../module-details";

export const SLICE_NAME = "Canvas";

export interface CanvasState {
  workflowDetails: Workflow | null;
  moduleDetails: ModuleDetails | null;
  selectedCellId: DiagramCellId | null;
  isInspectorOpened: boolean;
  isPublished: boolean | undefined;
  diagrammingService: DiagrammingService | undefined;
  selectedModule: Module | null;
  workflowVariables: WorkflowVariables | null;
  initUshurResponse: InitUshurResponse | null;
  continueUshurResponse: ContinueUshurResponse | null;
  ueTagVariables: GetVariablesByUeTagResponse | null;
  tagTypesResponse: GetTagTypesResponse | null;
  tagsResponse: GetTagsResponse | null;
  datatableTagsResponse: GetDatatableTagsResponse | null;
  isAddStepModalOpened: boolean;
  selectedMenuOption: MenuOption | null;
  addStepModalPosition: Position;
}

export interface Position {
  x: number;
  y: number;
}
